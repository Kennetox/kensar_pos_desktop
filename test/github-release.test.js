const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { planRelease, validateArtifacts } = require('../scripts/github-release.cjs');
const missing = async () => { throw Object.assign(new Error('not found'), { status: 404 }); };
function fixture() {
  return { version: '1.0.17', lockVersion: '1.0.17',
    context: { repo: { owner: 'test', repo: 'pos' }, ref: 'refs/heads/main', sha: 'commit-17' },
    github: { rest: { repos: { getReleaseByTag: missing, getLatestRelease: async () => ({ data: { tag_name: 'v1.0.16' } }), getCommit: async () => ({ data: { sha: 'commit-17' } }) }, git: { getRef: missing } } },
  };
}
test('main with a new version plans an automatic tag and release', async () => {
  assert.deepEqual(await planRelease(fixture()), { skip: false, tag: 'v1.0.17', release: null, hasTag: false });
});
test('published versions are never overwritten on a retry or same-version push', async () => {
  const input = fixture(); input.github.rest.repos.getReleaseByTag = async () => ({ data: { draft: false, prerelease: false } });
  assert.equal((await planRelease(input)).skip, true);
});
test('draft from same commit can be resumed', async () => {
  const input = fixture(); input.github.rest.repos.getReleaseByTag = async () => ({ data: { id: 12, draft: true } });
  input.github.rest.git.getRef = async () => ({ data: { object: { type: 'commit', sha: 'commit-17' } } });
  const result = await planRelease(input); assert.equal(result.skip, false); assert.equal(result.release.id, 12);
});
test('tag pointing to another commit is rejected', async () => {
  const input = fixture(); input.github.rest.git.getRef = async () => ({ data: { object: { type: 'commit', sha: 'old-commit' } } });
  await assert.rejects(planRelease(input), /otro commit/);
});
test('version mismatch, wrong branch and downgrade are rejected', async () => {
  await assert.rejects(planRelease({ ...fixture(), lockVersion: '1.0.16' }), /coincidir/);
  const wrongBranch = fixture(); wrongBranch.context.ref = 'refs/heads/feature';
  await assert.rejects(planRelease(wrongBranch), /main/);
  const old = fixture(); old.version = old.lockVersion = '1.0.15';
  await assert.rejects(planRelease(old), /mayor/);
  const wrongTag = fixture(); wrongTag.context.ref = 'refs/tags/v1.0.18';
  await assert.rejects(planRelease(wrongTag), /v1.0.17/);
});
test('API permission failures do not look like missing releases', async () => {
  const input = fixture(); input.github.rest.repos.getReleaseByTag = async () => { throw Object.assign(new Error('forbidden'), { status: 403 }); };
  await assert.rejects(planRelease(input), /forbidden/);
});
test('manifest must match version, installer checksum, size and required assets', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pos-release-'));
  try {
    const data = Buffer.from('test installer');
    const sha512 = crypto.createHash('sha512').update(data).digest('base64');
    const manifest = { version: '1.0.17', path: 'MetrikPOS-Setup.exe', sha512, files: [{ url: 'MetrikPOS-Setup.exe', sha512, size: data.length }] };
    fs.writeFileSync(path.join(dir, 'MetrikPOS-Setup.exe'), data);
    fs.writeFileSync(path.join(dir, 'MetrikPOS-Setup.exe.blockmap'), 'test blockmap');
    fs.writeFileSync(path.join(dir, 'latest.yml'), JSON.stringify(manifest));
    assert.equal(validateArtifacts(dir, '1.0.17').length, 3);
    assert.throws(() => validateArtifacts(dir, '1.0.18'), /no coincide/);
    fs.writeFileSync(path.join(dir, 'MetrikPOS-Setup.exe'), 'corrupt');
    assert.throws(() => validateArtifacts(dir, '1.0.17'), /no coincide/);
    fs.writeFileSync(path.join(dir, 'MetrikPOS-Setup.exe'), data);
    fs.unlinkSync(path.join(dir, 'MetrikPOS-Setup.exe.blockmap'));
    assert.throws(() => validateArtifacts(dir, '1.0.17'), /ENOENT/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

async function publicationFixture(callback) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'pos-publish-'));
  const previous = process.cwd();
  const events = [];
  const assets = [];
  const input = fixture();
  const rest = input.github.rest;
  rest.git.createRef = async () => { events.push('tag'); return {}; };
  rest.repos.createRelease = async (options) => { assert.equal(options.draft, true); events.push('draft'); return { data: { id: 1 } }; };
  rest.repos.listReleaseAssets = async () => {};
  input.github.paginate = async () => assets;
  rest.repos.uploadReleaseAsset = async (options) => {
    events.push(options.name);
    assets.push({ name: options.name, state: 'uploaded', size: options.data.length });
  };
  rest.repos.updateRelease = async (options) => {
    assert.equal(options.draft, false); assert.equal(options.make_latest, 'true');
    events.push('publish'); return { data: { draft: false, prerelease: false, html_url: 'https://example.com/release' } };
  };
  const summary = { addHeading() { return this; }, addLink() { return this; }, async write() {} };
  input.core = { setOutput() {}, info() {}, summary };
  input.phase = 'publish';
  try {
    process.chdir(directory);
    fs.mkdirSync('dist');
    fs.writeFileSync('package.json', JSON.stringify({ version: '1.0.17' }));
    fs.writeFileSync('package-lock.json', JSON.stringify({ version: '1.0.17', packages: { '': { version: '1.0.17' } } }));
    const data = Buffer.from('fake installer');
    const sha512 = crypto.createHash('sha512').update(data).digest('base64');
    fs.writeFileSync('dist/MetrikPOS-Setup.exe', data);
    fs.writeFileSync('dist/MetrikPOS-Setup.exe.blockmap', 'blockmap');
    fs.writeFileSync('dist/latest.yml', JSON.stringify({ version: '1.0.17', path: 'MetrikPOS-Setup.exe', sha512,
      files: [{ url: 'MetrikPOS-Setup.exe', sha512, size: data.length }] }));
    await callback(input, events);
  } finally { process.chdir(previous); fs.rmSync(directory, { recursive: true, force: true }); }
}
test('release becomes public only after all three assets are uploaded', async () => {
  await publicationFixture(async (input, events) => {
    await require('../scripts/github-release.cjs').run(input);
    assert.deepEqual(events, ['tag', 'draft', 'MetrikPOS-Setup.exe', 'MetrikPOS-Setup.exe.blockmap', 'latest.yml', 'publish']);
  });
});
test('upload failure leaves the release unpublished', async () => {
  await publicationFixture(async (input, events) => {
    input.github.rest.repos.uploadReleaseAsset = async () => { throw new Error('upload failed'); };
    await assert.rejects(require('../scripts/github-release.cjs').run(input), /upload failed/);
    assert.deepEqual(events, ['tag', 'draft']);
  });
});
