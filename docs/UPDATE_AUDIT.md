# Actualizaciones de escritorio — 4 de noviembre de 2026

## Hallazgos comprobados

- GitHub tiene v1.0.16 publicada el 31 de octubre de 2026, sin marca de borrador ni prerelease. El manifiesto latest.yml también declara 1.0.16. Incluye latest.yml, MetrikPOS-Setup.exe y blockmap. No incluye artefactos macOS.
- La carpeta local original conserva package.json 1.0.15 y cambios pendientes. origin/main declara 1.0.16. Electron lee app.getVersion() del paquete ejecutado; iniciar con electron . no instala releases y app.isPackaged es falso.
- El flujo publicado descargaba automáticamente, comprobaba cada seis horas e instalaba al salir. No llamaba quitAndInstall ni implementaba una cuenta regresiva.
- Los eventos se enviaban sin conservar estado; podían perderse antes de la suscripción de la pantalla. El renderer ignoraba el porcentaje recibido.
- Dos workflows publicaban. El flujo definitivo usa un solo workflow para crear tag y publicar desde main; los builds de PR son solo de prueba. Consulta [la guía vigente](DEPLOYMENT.md).
- No se han inspeccionado los registros ni la instalación del Dell. No hay evidencia suficiente para afirmar si falló la descarga, si quedó pendiente de cerrar, si hubo un problema de permisos o si se abrió otra instalación.

## Implementación preparada: 1.0.17

Consulta manual y reintento, estado persistente en memoria del proceso principal, suscripciones con limpieza, porcentaje, versión disponible e instalada, guía en configuración y aviso visible durante la operación. El cajero inicia el reinicio y puede cancelarlo durante 15 segundos; no se reinicia automáticamente en medio de una venta. Se mantiene la instalación al salir. macOS/desarrollo explican por qué no se puede actualizar por este canal.

## Publicación y trabajo local actuales

Los cambios se integraron en las carpetas originales `kensar_frontend` y `kensar_pos_desktop`, por petición del dueño.
La aplicación original ya declara 1.0.17. Las copias separadas iniciales no son la fuente de los ajustes posteriores.

La guía vigente es [DEPLOYMENT.md](DEPLOYMENT.md): un push aprobado a main con versión nueva crea el tag y publica
el release automáticamente tras validar los archivos. Sustituye el procedimiento inicial de tag manual y publicación de drafts.

No se publicó ningún commit, tag ni instalador durante esta preparación.
