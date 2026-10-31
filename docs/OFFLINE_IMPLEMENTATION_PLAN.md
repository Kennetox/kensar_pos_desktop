# Plan de continuidad: Metrik POS Desktop offline

**Actualizado:** 2026-10-31 (tras auditoría y QA manual de punta a punta en macOS)  
**Estado general:** la contingencia de ventas normales funciona de punta a punta en desarrollo local y superó la batería de pruebas manuales: caídas reales, backend colgado, cierres abruptos de la app, cierres de contingencia y reinicio sin red. El POS conserva catálogo, autorizaciones, clientes y ventas pendientes, cobra e imprime un comprobante provisional sin API y se pone al día solo cuando vuelve el backend. **Aún no está listo para producción:** falta validarlo en Windows con el instalador real, imprimir y escanear un ticket offline en hardware real, y hacer una prueba de carga de la cola (ver *Pendientes prioritarios*).

## Alcance acordado

| Permitido sin conexión | No permitido sin conexión |
|---|---|
| Venta normal, efectivo, tarjeta, transferencia, QR y pago múltiple. La confirmación de medios electrónicos es manual por caja. | Devoluciones, cambios, abonos, créditos, separados/reservados, nueva venta sobre una venta retenida y edición de clientes existentes. |
| Selección de clientes existentes desde la copia local y creación de un cliente nuevo para usarlo en ventas offline. | Operaciones que necesitan validar o modificar documentos ya existentes en el servidor. |

Límites por estación y autorización vigente: **125 ventas** o **$25.000.000 COP** acumulados. Se eligieron para cubrir el máximo diario histórico (122 ventas) sin dejar la caja aislada indefinidamente.

## Estado real

| Área | Estado | Detalle |
|---|---|---|
| UI local y watchdog | Implementado; falta validar en Windows | Next estático servido desde Electron. Los payloads `.txt` de Next se sirven como `text/plain`: con otro tipo, cada navegación interna recargaba la página y abortaba peticiones (`ERR_ABORTED`). |
| Salud API | Implementado y probado | Electron consulta **`/healthz`** (no `/readyz`) cada 5 s con timeout de 10 s. En producción usa `electron.net.fetch`; en local, un socket de Node **sin keep-alive**: reutilizar el socket producía `ECONNRESET` falsos contra Uvicorn. |
| Máquina de conectividad | Implementado y probado | `connectivity-state.js`, con pruebas unitarias. Un fallo aislado queda en `reconnecting` sin avisos y la caja sigue online. **Tres fallos seguidos** confirman la caída (`connection`, o `degraded` si es error HTTP). Tras una caída, **dos lecturas sanas** (`recovering` → `healthy`). Un fallo en `recovering` regresa directo a la caída. Un timeout que vence tarde (proceso bloqueado o suspendido) cuenta como **inconcluso**, no como caída. Solo el proceso principal emite estados; preload y React los consumen. |
| SQLite local | Implementado | `node:sqlite`, WAL, migraciones, integridad SHA-256 del snapshot (con caché de la copia ya verificada), cola de ventas y clientes, libro y cierres de contingencia en `userData/offline/pos.sqlite`. |
| Snapshot periódico | Implementado | Se descarga al iniciar sesión y cada 30 min mientras hay sesión online, con intervalo mínimo para no repetir descargas entre login y POS. La sustitución es atómica: una descarga fallida o interrumpida conserva la copia anterior (probado matando la app a mitad de la descarga). |
| Catálogo offline | Implementado | Productos activos, grupos, medios de pago, ajustes y clientes POS activos (sin cuentas web/invitados). Solo URLs de imágenes, no binarios. |
| Login offline | Implementado y probado | Vigencia de **96 h**. **Cualquier ingreso en línea en una estación habilita offline a todos los usuarios que pueden entrar por PIN en ella** (mismas reglas que el login normal: activo, con PIN y rol distinto de Gestor Web). En cada renovación la caja reemplaza el conjunto completo, así que un usuario desactivado o un PIN cambiado dejan de servir en el siguiente ingreso en línea. Las autorizaciones se cifran con `safeStorage` y el PIN se verifica localmente con PBKDF2 asíncrono, sin bloquear el proceso principal. Si el permiso venció, el login explica la causa en lugar de decir "PIN inválido". |
| Venta offline | Implementado y probado | Venta normal y pago múltiple se escriben primero en `offline_sales_outbox`; los límites se validan en UI y en SQLite. |
| Recuperación automática | Implementado y probado | Con una sesión normal registrada, la cola arranca a los 3 s de volver a `healthy` y luego reintenta cada 60 s si quedan pendientes. Reencolar una venta existente no emite eventos: antes esto formaba un bucle exponencial que saturaba Electron y era la causa de los "Verificando conexión" y los timeouts de 17-74 s. Una venta ya confirmada nunca se vuelve a encolar. |
| Consecutivos | Implementado y probado | La reserva toma el mayor entre el consecutivo actual y el mínimo sugerido por el POS. Con un `kill -9` durante el envío no hubo duplicados ni huecos en la numeración. |
| Tickets y trazabilidad | Implementado; falta prueba física | El comprobante muestra la referencia `OFF-…`, pero su **código de barras es numérico de 16 dígitos** (`9` + los primeros 48 bits del `client_request_id`, Code 128-C). Tiene la misma densidad que un ticket `V-…`; el `OFF-…` en código de barras salía con barras de <2 puntos en térmica de 80 mm. Escanear el número o el `OFF-…` abre la venta oficial en devoluciones y cambios. Los tickets `OFF-…` ya impresos siguen funcionando. |
| Precio y catálogo posterior | Implementado; falta prueba integral | La venta offline guarda la versión del snapshot y la hora de captura; al sincronizar conserva el precio cobrado. Producto eliminado, autorización vencida/revocada o datos inválidos siguen siendo conflictos a revisar. |
| Clientes offline | Implementado y probado | Clave offline idempotente en `offline_customers_outbox`. Al reconectar se crea o reutiliza el cliente antes de enviar la venta que lo usa (probado: un único cliente). |
| UI de contingencia | Implementado y probado | La cabecera del POS no muestra indicador offline. El estado ("Sin conexión · N pendientes") y la cola viven en el menú **Acciones de caja**. Solo hay avisos breves ante una caída confirmada y ante su recuperación; los fallos aislados no se anuncian. Con sesión offline y la red de vuelta, se ofrece "Reanudar sesión" para pedir el PIN. |
| Cierre de caja en contingencia | Implementado y probado | Diálogo de **Cierre de contingencia** (`CONT-…`), con efectivo contado y observaciones; no es un Reporte Z. Al volver la conexión se sincronizan primero las ventas y después los cierres, **del más antiguo al más reciente**. Cada cierre se consolida con `bound_to_closed_at`: el servidor solo incluye lo ocurrido hasta su hora de cierre. |
| Corte para cierre offline | Implementado y probado | Corte del snapshot + ventas online posteriores + ventas offline sincronizadas después del corte (registradas con la hora del servidor) + ventas offline pendientes. El efectivo descuenta el cambio entregado. **El cierre es por día de Bogotá:** si el último corte es de un día anterior, el cierre de hoy empieza en cero. |
| Gestión administrativa de contingencias | Implementado | Documentos > Contingencias offline. Los rechazos causados solo por el bloqueo de contingencias abiertas ya no se registran como conflictos nuevos (antes bloqueaban el propio cierre en cada reintento). |
| Diagnóstico | Implementado (temporal) | `diagnostics.js`, activo en local o con `POS_DIAGNOSTICS=1`. Solo registra anomalías: bloqueos del event loop, IPC lentos (con conteo por canal), `safeStorage` y operaciones del snapshot. |

## Flujo operativo actual

1. Con conexión, login de PIN: descarga el snapshot y renueva las autorizaciones offline de **todos** los usuarios elegibles de la estación.
2. Durante la sesión online, la copia local y las autorizaciones se renuevan en segundo plano.
3. Si el monitor confirma la caída (tres fallos), el POS usa la copia local y solo permite el alcance de contingencia. Sin red, se puede iniciar sesión con cualquier PIN autorizado hasta 96 h después del último ingreso en línea en esa caja.
4. La venta se guarda localmente antes de limpiar el carrito y se imprime un comprobante provisional no fiscal (`OFF-…`, con código de barras numérico).
5. Si se creó un cliente sin red, la venta conserva sus datos y su `client_request_id` de cliente.
6. Al recuperar la API con una sesión normal, a los 3 s se envían primero los clientes, luego las ventas en orden (reserva de consecutivo + venta idempotente) y por último los cierres de contingencia, del más antiguo al más reciente. Una sesión offline debe reanudarse con PIN antes de sincronizar.
7. Electron guarda el vínculo comprobante offline → documento oficial, retira la venta de la cola y la registra en el libro de cierre con la hora del servidor.

### Regla operativa de cierre sin red

- El personal **puede terminar el turno y abrir el siguiente sin conexión**. El comprobante dice `Cierre de contingencia · pendiente de consolidación`; no se presenta como documento fiscal ni como Reporte Z.
- Cada cierre local incluye solo lo de su día de Bogotá y lo anterior a su hora de cierre. Un segundo cierre durante la misma caída empieza en cero.
- Al volver el servidor se consolidan primero las ventas y después los cierres, en orden cronológico. Si algo no se puede consolidar, el cierre queda pendiente y visible para administración; nunca se borra.
- Un cierre oficial se bloquea mientras la estación tenga conflictos offline sin resolver.

## Contrato backend implementado

- `GET /healthz`: liveness usado por el monitor de la caja. `GET /readyz` existe, pero no decide la contingencia.
- `GET /pos/offline-snapshot`: catálogo mínimo, clientes POS activos, configuración de ticket y `closure_baseline`.
- `POST /auth/pos-offline-grants` (**nuevo**): autorizaciones de 96 h para todos los usuarios elegibles de la estación. `POST /auth/pos-offline-grant` (individual) se mantiene para escritorios anteriores.
- `POST /pos/sales/reserve-number` y `POST /pos/sales` (idempotente por `client_request_id`). La respuesta de venta incluye `offline_synced_at`.
- `POST /pos/closures` acepta `bound_to_closed_at: true` (cierres de contingencia acotados a su hora de cierre).
- `GET /pos/sales/history?term=`: acepta `OFF-…` y el código numérico de 16 dígitos. Un número largo (EAN, por ejemplo) ya no provoca error 500 por desbordar `sale_number`.
- `POST /pos/customers/offline-sync`, `POST /pos/offline-reconciliations/report`, `GET /pos/offline-reconciliations`, `POST /pos/offline-reconciliations/{id}/resolve`.
- Los schedulers del backend (reportes mensuales, notificaciones, Kora) se ejecutan en hilos: dentro del event loop congelaban `/healthz` y todas las cajas veían una falsa caída.

Todos los campos y rutas nuevos son aditivos: un backend anterior los ignora. **Desplegar primero el backend y después Desktop.**

## Referencias de implementación

- `kensar_pos_desktop/main.js`, `preload.js`: monitor, IPC de snapshot, autorizaciones, cola y cierres.
- `kensar_pos_desktop/connectivity-state.js`, `health-probe.js`, `diagnostics.js`: máquina de estados, sondeo y diagnóstico.
- `kensar_pos_desktop/local-store.js`: SQLite, snapshot, colas, libro y cierres `CONT-…`, autorizaciones.
- `kensar_pos_desktop/test/`: pruebas (`npm test`).
- `kensar_backend/routers/auth.py`, `routers/pos.py`, `crud.py`, `schemas.py`, `security.py`, `services/legacy_imports.py`, `main.py`.
- `kensar_frontend/lib/pos/offlineReceiptBarcode.ts`: código numérico del comprobante offline.
- `kensar_frontend/lib/pos/pendingSales.ts`, `offlineCatalog.ts`, `offlineCustomers.ts`.
- `kensar_frontend/app/pos/page.tsx`, `pago/`, `devoluciones/`, `cambios/`, `app/login-pos/page.tsx`, `lib/printing/saleTicket.ts`.
- `kensar_frontend/app/dashboard/documents/offline-incidents/page.tsx`.

## Pendientes prioritarios

1. **Validación en Windows con el instalador real** (`npm run dist:win`): `node:sqlite`, `safeStorage` (DPAPI), kiosk, reinicios y la ruta `electron.net.fetch` contra producción. Cortar la red con el cable o el Wi-Fi, no deteniendo el backend. Bloquea la publicación.
2. **Prueba física del código de barras offline:** imprimir en la térmica de la caja y escanear con el lector omnidireccional en Devoluciones, junto a un ticket `V-…` de referencia.
3. **Carga de la cola:** reconectar con 10, 100 y 125 ventas pendientes y verificar orden, tiempos y documentos oficiales.
4. **Decisión pendiente: cobro con el backend colgado.** Si el servidor se cuelga justo al cobrar online, el cajero espera unos 20 s y ve un error breve; no hay pérdida ni duplicado. Propuesta: pasar automáticamente a la cola offline (es seguro por la idempotencia).
5. **Reintentos por registro:** backoff exponencial y separar errores transitorios de conflictos de negocio. Hoy un conflicto persistente se reintenta cada 60 s.
6. **Cambios hechos desde otras cajas** (precio, inventario, producto desactivado) mientras esta está offline: validar el manejo acordado.
7. **Entrega del ticket oficial** después de sincronizar: definir si basta con el historial o si se reimprime o envía.
8. **Seguridad y datos personales:** retención y cifrado de los datos de clientes en el equipo, borrado al revocar la estación. Recomendar PIN de 6 dígitos (la caja guarda los PIN protegidos de todos los usuarios elegibles). Un usuario dado de baja conserva hasta 96 h de acceso en una caja que siga sin red.
9. **Venta offline de un día ya cerrado:** si se sincroniza después del Reporte Z de su día, queda pendiente en el servidor, porque el cierre siguiente solo toma su propio día. Definir cómo consolidarla.
10. **Pruebas del backend desactualizadas:** 30 pruebas fallan por la validación de estación del commit `a7b0c1d`; no por esta funcionalidad.

## Pruebas de aceptación

Hechas el 2026-10-31 en macOS (Electron + backend propio + copia aislada de datos), con resultado correcto:

- Arranque online sin avisos falsos, sin `ECONNRESET` y con navegación interna sin recargas.
- Caída real del backend, backend colgado (`SIGSTOP`) y caída breve de menos de 5 s (sin pasar a offline).
- Venta simple, pago múltiple y cliente nuevo offline; límite de $25.000.000.
- Recuperación sin duplicados ni pérdidas; contingencias registradas como resueltas.
- Reinicio de Electron sin red con login por PIN offline, reanudación con PIN y sincronización.
- Cajero que nunca entró en la caja inicia sesión offline gracias al ingreso en línea de otro; desactivarlo lo retira en la siguiente renovación.
- `kill -9` con una venta en vuelo que el servidor registró: no se duplica; cierre de la app durante la descarga del snapshot: la copia anterior queda intacta.
- Dos cierres de contingencia seguidos: cada Reporte Z oficial con sus ventas y diferencia $0. Cierre al día siguiente con el corte de ayer: solo cuenta lo de hoy.
- Modo mantenimiento y sesión revocada con ventas en cola (la cola se conserva).
- Escaneo del código offline en Devoluciones y Cambios tras sincronizar.

Pendientes: Windows empaquetado, impresión y escaneo físico, cola de 100 a 125 ventas, cambios desde otras cajas y diálogo "Sincronización en curso" al cerrar (los datos sí se verificaron).

## Relevo

- Hay cambios sin commit en los tres repositorios; revisar `git status` antes de integrar. `kensar_frontend/desktop-pos/` y varios archivos nuevos están sin trackear.
- Orden de despliegue: backend primero (reiniciar Uvicorn) y después Desktop.
- Para probar sin tocar datos reales: `POS_USER_DATA_DIR=<copia>`. En terminales de VS Code, quitar `ELECTRON_RUN_AS_NODE`.
- Datos de prueba que quedaron en la base local de desarrollo: ventas con nota "PRUEBA QA", el cliente "Cliente QA Offline", el usuario "Cajero QA Offline" (desactivado) y los cierres `CL-000066` (con un faltante falso de $164.000, producto del error de orden ya corregido), `CL-000067` y `CL-000068`. Las contingencias de prueba quedaron resueltas.
