# Metrik POS Desktop

Aplicación Electron de caja con interfaz local y operación offline.

- **[Guía de despliegue y releases automáticos](docs/DEPLOYMENT.md)**: preparación, publicación de Windows y recuperación de fallos.
- [Auditoría del actualizador](docs/UPDATE_AUDIT.md).
- [Plan de implementación offline](docs/OFFLINE_IMPLEMENTATION_PLAN.md).

## Desarrollo local

`npm start` recompila la interfaz desde `../kensar_frontend` y abre Electron contra la API local.
La versión visible se obtiene de `package.json`. El actualizador automático funciona en Windows instalado;
`electron .` y macOS de desarrollo no descargan los releases Windows.
