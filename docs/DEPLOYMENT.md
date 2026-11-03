# Despliegue de Metrik POS Desktop

Guía vigente desde la versión 1.0.17. No hace falta crear tags ni publicar borradores manualmente en GitHub.

## Qué dispara la publicación

Un **push a `main` de `Kennetox/kensar_pos_desktop`** ejecuta el workflow **Publicar Metrik POS Windows**.
La versión de `package.json` determina el tag: por ejemplo, `1.0.17` → `v1.0.17`.

- Versión nueva: prueba, compila, crea el tag en ese commit, sube los archivos y publica el release estable como Latest.
- Versión ya publicada: termina sin modificar el release. Un cambio visible necesita una versión nueva.
- Versión inferior a la última estable, versiones inconsistentes o tag de otro commit: falla y explica el motivo.
- No incrementa versiones por cada push: se decide la versión al preparar el despliegue.
- También admite un tag manual coincidente y `workflow_dispatch` desde `main` para recuperación; no son pasos necesarios del despliegue normal.

Todo ocurre en el mismo workflow: un tag creado con `GITHUB_TOKEN` no dispara otro workflow de push.
No requiere un token personal ni otro secreto; usa el `GITHUB_TOKEN` temporal con `contents: write`.
Si las reglas del repositorio/organización impiden crear tags o releases, el workflow fallará con el error de permisos.

## Preparar el despliegue en tres pasos

### 1. Preparar la versión y la interfaz offline

Trabajar en la copia acordada con el dueño, preservando sus cambios pendientes. No hacer reset/stash/pull destructivo.
Leer las instrucciones de frontend/backend si el despliegue también los modifica.

Desde `kensar_pos_desktop`:

```bash
# Solo cuando corresponda incrementar: 1.0.17 ya está preparada.
npm version patch --no-git-tag-version
npm run build:pos-ui
npm test
```

El primer comando actualiza `package.json` y `package-lock.json` sin crear tags.
`build:pos-ui` requiere el frontend hermano `../kensar_frontend` y genera `pos-ui/`.
**Incluir esa carpeta completa en el commit**: GitHub compila exactamente esa interfaz; no descarga el frontend.
Si cambias la interfaz después de compilar, vuelve a ejecutar `build:pos-ui`.

Preparar la nota de actualización en el backend según `../kensar_backend/docs/release-process.md`.
Si también se despliega la web, respetar el orden backend → frontend. Publicar solo Vercel no actualiza la interfaz incluida en Electron.

### 2. Revisar y subir el commit a main

Revisar el diff y los archivos seleccionados; incluir los cambios necesarios, `package.json`, `package-lock.json`,
`pos-ui/`, workflows y scripts de publicación cuando hayan cambiado. Añadir rutas explícitas, nunca `git add .`.
No incluir `.env`, bases de datos, credenciales ni `dist/`.

Pedir la confirmación habitual del dueño antes del push a `main`. **Ese push ya autoriza y dispara la publicación automática**:
no hay un paso posterior para aprobar un draft ni un comando `git tag` obligatorio.

### 3. Verificar el resultado y una caja Windows

Esperar el workflow `Publicar Metrik POS Windows` en verde. Se puede consultar desde terminal:

```bash
gh run list --repo Kennetox/kensar_pos_desktop --workflow release-windows.yml --limit 5
gh release view v1.0.17 --repo Kennetox/kensar_pos_desktop --json tagName,isDraft,isPrerelease,assets,url
```

Usar la versión del despliegue. `isDraft` e `isPrerelease` deben ser `false`; los archivos esperados son:

- `MetrikPOS-Setup.exe`
- `MetrikPOS-Setup.exe.blockmap`
- `latest.yml`, con la misma versión y SHA-512 del instalador

En Windows instalado: buscar actualizaciones, esperar la descarga, terminar la operación de caja y pulsar
**Reiniciar e instalar**. Comprobar la versión después del reinicio y la operación offline.
Las instalaciones antiguas sin el botón manual revisan al arrancar y cada seis horas e instalan al cerrar.
Si no actualizan, instalar el EXE publicado sobre la instalación existente con POS cerrado, sin borrar los datos locales.

## Cómo evita un release incompleto

1. Valida versión, lockfile, referencia y tag existente.
2. Instala dependencias, ejecuta pruebas y comprueba las páginas offline.
3. Compila Windows x64 con `--publish never` (no publica desde electron-builder).
4. Verifica versión, tamaño y SHA-512 del instalador contra `latest.yml`, y exige los tres archivos no vacíos.
5. Crea el tag y un borrador temporal, sube los archivos y verifica tamaño/estado y SHA-256 remoto cuando GitHub lo proporciona.
6. Solo entonces publica con `draft: false`, `prerelease: false` y `make_latest: true`.

El borrador temporal protege a las cajas frente a descargas incompletas. **No queda pendiente de una acción manual si todo termina bien.**
Solo hay una publicación en curso a la vez. Los builds de PR y manuales de `windows-build.yml` generan artefactos de prueba, sin publicar.

## Si falla

- Antes de compilar/subir: el release anterior sigue disponible. Corregir la causa indicada en Actions.
- Durante la subida: puede quedar un tag y un borrador incompleto. Reejecutar **el workflow del mismo commit** con `gh run rerun ID --failed` o desde Actions.
  Reutiliza el borrador y reemplaza únicamente sus archivos; no modifica una versión ya publicada.
- Si hay que cambiar código después de crear un tag: incrementar versión y publicar un commit nuevo. No mover ni reutilizar ese tag.
- Si el job falló después de publicar: el reintento detecta la versión pública y no la sobrescribe. Comprobar sus archivos.
- Si el tag pertenece a otro commit: el flujo se detiene. Usar una versión nueva.
- No publicar un borrador incompleto manualmente para resolver un fallo.

## Alcance y validación

Este canal publica **Windows x64**. No crea paquetes ni autoactualizaciones macOS.
La automatización se activa cuando estos cambios lleguen a `main`; hasta entonces sigue vigente el workflow remoto anterior.
Validación local: pruebas de planificación (versión nueva, ya publicada, draft, conflictos, permisos) y validación de manifiesto/archivos.
La ejecución real de GitHub Actions y la instalación Windows deben verificarse en el próximo despliegue.

## Fuentes y mantenimiento

- [GITHUB_TOKEN y eventos de workflows](https://docs.github.com/en/actions/concepts/security/github_token).
- [Publicación de electron-builder](https://www.electron.build/publish/): el valor predeterminado de `releaseType` es `draft`.
- Implementación: `.github/workflows/release-windows.yml` y `scripts/github-release.cjs`.
- Pruebas: `test/github-release.test.js`.

Mantener esta guía actualizada al cambiar versiones, artefactos, plataformas o el flujo de publicación.
