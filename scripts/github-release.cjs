const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const newerThan = (a, b) => {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};
async function optional(request) {
  try { return (await request()).data; }
  catch (error) { if (error.status === 404) return null; throw error; }
}
async function planRelease({ github, context, version, lockVersion }) {
  if (!stableVersion.test(version) || version !== lockVersion) throw new Error('La versión estable de package.json y package-lock.json debe coincidir.');
  const tag = `v${version}`;
  if (context.ref !== 'refs/heads/main' && context.ref !== `refs/tags/${tag}`) {
    throw new Error(`Publica desde main o desde el tag ${tag}.`);
  }
  const repo = context.repo;
  const release = await optional(() => github.rest.repos.getReleaseByTag({ ...repo, tag }));
  if (release && !release.draft) {
    if (release.prerelease) throw new Error('Esta versión ya existe como prerelease. Usa una versión estable nueva.');
    return { skip: true, tag, release };
  }
  const latest = await optional(() => github.rest.repos.getLatestRelease(repo));
  if (latest) {
    const previous = latest.tag_name.replace(/^v/, '');
    if (!stableVersion.test(previous) || !newerThan(version, previous)) {
      throw new Error(`La versión ${version} debe ser mayor que ${latest.tag_name}.`);
    }
  }
  // Los tags existentes son inmutables. Admite tags ligeros y anotados.
  const ref = await optional(() => github.rest.git.getRef({ ...repo, ref: `tags/${tag}` }));
  if (ref) {
    let object = ref.object;
    while (object.type === 'tag') object = (await github.rest.git.getTag({ ...repo, tag_sha: object.sha })).data.object;
    const commit = (await github.rest.repos.getCommit({ ...repo, ref: context.sha })).data.sha;
    if (object.type !== 'commit' || object.sha !== commit) throw new Error(`${tag} pertenece a otro commit. No se reemplazará.`);
  }
  return { skip: false, tag, release, hasTag: Boolean(ref) };
}
function validateArtifacts(directory, version) {
  const yaml = require('js-yaml');
  const manifest = yaml.load(fs.readFileSync(path.join(directory, 'latest.yml'), 'utf8'));
  const name = 'MetrikPOS-Setup.exe';
  const installer = fs.readFileSync(path.join(directory, name));
  const hash = crypto.createHash('sha512').update(installer).digest('base64');
  const entry = manifest.files?.find((file) => file.url === name);
  if (manifest.version !== version || manifest.path !== name || manifest.sha512 !== hash ||
      !entry || entry.sha512 !== hash || entry.size !== installer.length) {
    throw new Error('latest.yml no coincide con la versión, tamaño o SHA-512 del instalador.');
  }
  const names = [name, `${name}.blockmap`, 'latest.yml'];
  const assets = names.map((name) => ({ name, data: fs.readFileSync(path.join(directory, name)) }));
  if (assets.some((asset) => !asset.data.length)) throw new Error('Hay archivos de actualización vacíos.');
  return assets;
}
async function run({ github, context, core, phase }) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  if (lock.packages[''].version !== pkg.version) throw new Error('La versión raíz del lock no coincide.');
  const plan = await planRelease({ github, context, version: pkg.version, lockVersion: lock.version });
  core.setOutput('publish', String(!plan.skip));
  core.setOutput('tag', plan.tag);
  if (plan.skip) { core.info(`${plan.tag} ya está publicada; no se modifican sus archivos.`); return; }
  if (phase === 'plan') return;
  const assets = validateArtifacts('dist', pkg.version);
  const repo = context.repo;
  if (!plan.hasTag) await github.rest.git.createRef({ ...repo, ref: `refs/tags/${plan.tag}`, sha: context.sha });
  const release = plan.release || (await github.rest.repos.createRelease({
    ...repo, tag_name: plan.tag, target_commitish: context.sha,
    name: `Metrik POS ${pkg.version}`, draft: true, prerelease: false, generate_release_notes: true,
  })).data;
  // Un reintento solo reemplaza archivos de un borrador del mismo commit.
  const existing = await github.paginate(github.rest.repos.listReleaseAssets, { ...repo, release_id: release.id, per_page: 100 });
  for (const asset of assets) {
    const old = existing.find((item) => item.name === asset.name);
    if (old) await github.rest.repos.deleteReleaseAsset({ ...repo, asset_id: old.id });
    await github.rest.repos.uploadReleaseAsset({
      ...repo, release_id: release.id, name: asset.name, data: asset.data,
      headers: { 'content-type': asset.name.endsWith('.yml') ? 'text/yaml' : 'application/octet-stream', 'content-length': asset.data.length },
    });
  }
  const uploaded = await github.paginate(github.rest.repos.listReleaseAssets, { ...repo, release_id: release.id, per_page: 100 });
  for (const asset of assets) {
    const remote = uploaded.find((item) => item.name === asset.name);
    if (!remote || remote.state !== 'uploaded' || remote.size !== asset.data.length) throw new Error(`Subida incompleta: ${asset.name}`);
    if (remote.digest && remote.digest !== `sha256:${crypto.createHash('sha256').update(asset.data).digest('hex')}`) throw new Error(`SHA-256 incorrecto: ${asset.name}`);
  }
  const published = (await github.rest.repos.updateRelease({ ...repo, release_id: release.id, draft: false, prerelease: false, make_latest: 'true' })).data;
  if (published.draft || published.prerelease) throw new Error('El release no quedó público y estable.');
  await core.summary.addHeading(`Publicado ${plan.tag}`).addLink('Abrir release', published.html_url).write();
}
module.exports = { run, planRelease, validateArtifacts, newerThan };
