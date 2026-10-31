const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { LocalPosStore } = require("../local-store");

const STATION = "station-test";
// Horas relativas al día actual de Bogotá (UTC-5, sin horario de verano). Las
// horas del servidor llegan sin zona; las locales, en ISO con Z.
const BOGOTA_OFFSET_MS = 5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const bogotaDayStartMs = () => Math.floor((Date.now() - BOGOTA_OFFSET_MS) / DAY_MS) * DAY_MS + BOGOTA_OFFSET_MS;
const serverIso = (ms) => new Date(ms).toISOString().replace("Z", "");
const inAMinute = () => new Date(Date.now() + 60_000).toISOString();

const makeStore = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "metrik-pos-store-"));
  const store = new LocalPosStore(dir);
  store.initialize({ stationId: STATION, deviceId: "device-test" });
  return { store, dir, cleanup: () => { store.close(); fs.rmSync(dir, { recursive: true, force: true }); } };
};

const snapshot = (version, products = [{ id: 1, name: "Producto", price: 1000, active: true }]) => ({
  schema_version: 1,
  snapshot_version: version,
  generated_at: serverIso(bogotaDayStartMs() + 1000),
  station: { id: STATION },
  products,
  payment_methods: [{ id: 1, name: "Efectivo", slug: "cash" }],
  customers: [],
  closure_baseline: { captured_at: serverIso(bogotaDayStartMs() + 1000), total_amount: 0, sales_count: 0 },
});

test("snapshot: guarda, lee desde caché y se invalida al reemplazarlo", () => {
  const { store, cleanup } = makeStore();
  try {
    assert.equal(store.getOfflineSnapshot(STATION), null);
    store.replaceOfflineSnapshot(snapshot("v1"));
    const first = store.getOfflineSnapshot(STATION);
    assert.equal(first.snapshotVersion, "v1");
    assert.equal(store.getOfflineSnapshot(STATION), first, "la segunda lectura reutiliza la copia verificada");
    assert.equal(store.getOfflineSnapshotVersion(STATION), "v1");

    store.replaceOfflineSnapshot(snapshot("v2", [{ id: 2, name: "Otro", price: 5, active: true }]));
    const second = store.getOfflineSnapshot(STATION);
    assert.equal(second.snapshotVersion, "v2");
    assert.equal(second.snapshot.products[0].id, 2);
  } finally {
    cleanup();
  }
});

test("snapshot: detecta un payload alterado aunque hubiera caché", () => {
  const { store, dir, cleanup } = makeStore();
  try {
    store.replaceOfflineSnapshot(snapshot("v1"));
    store.getOfflineSnapshot(STATION);
    const other = new DatabaseSync(path.join(dir, "offline", "pos.sqlite"));
    other.prepare("UPDATE offline_snapshots SET payload_json = ?, payload_sha256 = ?, received_at = ?")
      .run("{\"tampered\":true}", "0".repeat(64), "2026-10-31T11:00:00.000Z");
    other.close();
    assert.throws(() => store.getOfflineSnapshot(STATION), /integridad/);
  } finally {
    cleanup();
  }
});

test("cola: venta offline pendiente, reintento y consolidación", () => {
  const { store, cleanup } = makeStore();
  try {
    store.replaceOfflineSnapshot(snapshot("v1"));
    store.enqueueOfflineSale({ id: "sale-1", stationId: STATION, payload: { total: 1000, payments: [{ method: "cash", amount: 1000 }] }, summary: { total: 1000 } });
    // Encolar dos veces el mismo id es idempotente.
    store.enqueueOfflineSale({ id: "sale-1", stationId: STATION, payload: {}, summary: { total: 1000 } });
    assert.equal(store.getOfflineSales(STATION).length, 1);

    assert.equal(store.markOfflineSaleSyncing("sale-1"), true);
    assert.equal(store.markOfflineSalePending("sale-1", "Error 503"), true);
    const [pending] = store.getOfflineSales(STATION);
    assert.equal(pending.state, "pending");
    assert.equal(pending.lastError, "Error 503");
    assert.equal(pending.syncAttempts, 1);

    const preview = store.getOfflineClosurePreview(STATION, inAMinute());
    assert.equal(preview.summary.totalAmount, 1000);
    assert.equal(preview.summary.totalCash, 1000);

    const receipt = store.completeOfflineSale("sale-1", { id: 77, sale_number: 12, document_number: "V-12" });
    assert.equal(receipt.saleId, 77);
    assert.equal(store.getOfflineSales(STATION).length, 0);
  } finally {
    cleanup();
  }
});

test("cola: una venta confirmada no se resucita al reencolar un espejo viejo", () => {
  const { store, cleanup } = makeStore();
  try {
    const record = { id: "sale-2", stationId: STATION, payload: { total: 500 }, summary: { total: 500 } };
    assert.equal(store.hasOfflineSale("sale-2"), false);
    store.enqueueOfflineSale(record);
    assert.equal(store.hasOfflineSale("sale-2"), true);
    store.completeOfflineSale("sale-2", { id: 88, sale_number: 13, document_number: "V-13" });
    assert.equal(store.hasOfflineSale("sale-2"), true, "sigue registrada como confirmada");
    store.enqueueOfflineSale(record);
    assert.equal(store.getOfflineSales(STATION).length, 0);
  } finally {
    cleanup();
  }
});

test("cierre: el cambio entregado se descuenta del efectivo", () => {
  const { store, cleanup } = makeStore();
  try {
    store.replaceOfflineSnapshot(snapshot("v1"));
    store.enqueueOfflineSale({
      id: "sale-change",
      stationId: STATION,
      payload: { payments: [{ method: "cash", amount: 20000 }] },
      summary: { total: 14000 },
    });
    store.enqueueOfflineSale({
      id: "sale-mixed",
      stationId: STATION,
      payload: { payments: [{ method: "cash", amount: 5000 }, { method: "nequi", amount: 10000 }] },
      summary: { total: 14000 },
    });
    const preview = store.getOfflineClosurePreview(STATION, inAMinute());
    assert.equal(preview.summary.totalAmount, 28000);
    assert.equal(preview.summary.totalCash, 18000);
    assert.equal(preview.summary.totalNequi, 10000);
  } finally {
    cleanup();
  }
});

test("cierre: una venta offline sincronizada después del corte sigue contando", () => {
  const { store, cleanup } = makeStore();
  try {
    // Corte del snapshot al comienzo del día (reloj del servidor).
    store.replaceOfflineSnapshot(snapshot("v1"));
    store.enqueueOfflineSale({ id: "sale-a", stationId: STATION, payload: { payments: [{ method: "nequi", amount: 7000 }] }, summary: { total: 7000 } });
    store.completeOfflineSale("sale-a", { id: 90, sale_number: 20, document_number: "V-20", offline_synced_at: serverIso(Date.now()) });
    const afterSync = store.getOfflineClosurePreview(STATION, inAMinute());
    assert.equal(afterSync.summary.totalAmount, 7000, "el corte es anterior a la llegada al servidor");
    assert.equal(afterSync.summary.totalNequi, 7000);

    // Un snapshot nuevo, con corte posterior, ya incluye la venta en su base.
    const fresh = snapshot("v2");
    fresh.closure_baseline = { captured_at: serverIso(Date.now() + 1000), total_amount: 7000, total_nequi: 7000, sales_count: 1 };
    store.replaceOfflineSnapshot(fresh);
    const afterFreshSnapshot = store.getOfflineClosurePreview(STATION, inAMinute());
    assert.equal(afterFreshSnapshot.summary.totalAmount, 7000, "no se cuenta dos veces");
    assert.equal(afterFreshSnapshot.summary.salesCount, 1);
  } finally {
    cleanup();
  }
});

test("cierre: abrir sin internet con el último corte de ayer solo cuenta lo de hoy", () => {
  const { store, cleanup } = makeStore();
  try {
    const yesterdayEvening = bogotaDayStartMs() - 5 * 60 * 60 * 1000;
    const old = snapshot("ayer");
    old.closure_baseline = { captured_at: serverIso(yesterdayEvening), total_amount: 500000, total_cash: 500000, sales_count: 20 };
    store.replaceOfflineSnapshot(old);
    // Venta online de ayer, posterior al corte (ayer se cerró con Reporte Z).
    store.recordClosureLedgerSale({ id: "sale-ayer", stationId: STATION, summary: { total: 80000, payload: { payments: [{ method: "cash", amount: 80000 }] } }, occurredAt: serverIso(yesterdayEvening + 60 * 60 * 1000) });
    store.enqueueOfflineSale({ id: "venta-hoy", stationId: STATION, payload: { payments: [{ method: "cash", amount: 30000 }] }, summary: { total: 30000 } });

    const preview = store.getOfflineClosurePreview(STATION, inAMinute());
    assert.equal(preview.summary.totalAmount, 30000);
    assert.equal(preview.summary.totalCash, 30000);
    assert.equal(preview.summary.salesCount, 1);

    const closure = store.createOfflineClosure({ stationId: STATION, summary: preview.summary, details: preview.details, closedAt: inAMinute() });
    assert.deepEqual(closure.details.saleRequestIds, ["venta-hoy"]);
    assert.deepEqual(closure.details.onlineSaleIds, [], "la venta de ayer no entra al cierre de hoy");
  } finally {
    cleanup();
  }
});

test("autorizaciones offline: cada renovación reemplaza el conjunto de la estación", () => {
  const { store, cleanup } = makeStore();
  try {
    const future = new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString();
    store.replaceOfflineAuthorizations(STATION, [
      { userId: 1, encryptedGrant: "a", expiresAt: future },
      { userId: 2, encryptedGrant: "b", expiresAt: future },
      { userId: 3, encryptedGrant: "c", expiresAt: future },
    ]);
    assert.deepEqual(store.getOfflineAuthorizations(STATION).map((row) => row.user_id).sort(), [1, 2, 3]);
    // El usuario 2 fue desactivado: la siguiente renovación ya no lo incluye.
    store.replaceOfflineAuthorizations(STATION, [
      { userId: 1, encryptedGrant: "a2", expiresAt: future },
      { userId: 3, encryptedGrant: "c2", expiresAt: future },
    ]);
    const rows = store.getOfflineAuthorizations(STATION);
    assert.deepEqual(rows.map((row) => row.user_id).sort(), [1, 3]);
    assert.ok(rows.every((row) => row.encrypted_grant.endsWith("2")));
  } finally {
    cleanup();
  }
});

test("cola: cliente offline se confirma con el id oficial", () => {
  const { store, cleanup } = makeStore();
  try {
    store.enqueueOfflineCustomer({ id: "customer-1", stationId: STATION, payload: { name: "Cliente" } });
    assert.equal(store.getOfflineCustomers(STATION).length, 1);
    store.markOfflineCustomerSyncing("customer-1");
    store.completeOfflineCustomer("customer-1", 501);
    assert.equal(store.getOfflineCustomers(STATION).length, 0);
    const [confirmed] = store.getOfflineCustomers(STATION, { includeSynced: true });
    assert.equal(confirmed.syncedCustomerId, 501);
  } finally {
    cleanup();
  }
});
