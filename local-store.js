const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const crypto = require("crypto");

const SCHEMA_VERSION = 9;
const OFFLINE_SALES_MAX_COUNT = 125;
const OFFLINE_SALES_MAX_TOTAL = 25_000_000;
// Colombia no tiene horario de verano: el día de Bogotá empieza a las 05:00 UTC.
const BOGOTA_OFFSET_MS = 5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Inicio (UTC, ISO) del día de Bogotá al que pertenece `value`. Las horas del
// servidor llegan sin zona y son UTC.
const bogotaDayStartIso = (value) => {
  const text = String(value || "");
  const time = Date.parse(/[zZ]|[+-]\d{2}:?\d{2}$/.test(text) ? text : `${text}Z`);
  const base = Number.isFinite(time) ? time : Date.now();
  return new Date(Math.floor((base - BOGOTA_OFFSET_MS) / DAY_MS) * DAY_MS + BOGOTA_OFFSET_MS).toISOString();
};

const emptyClosureBaseline = (reason) => ({
  total_amount: 0,
  total_cash: 0,
  total_card: 0,
  total_qr: 0,
  total_nequi: 0,
  total_daviplata: 0,
  total_credit: 0,
  total_refunds: 0,
  net_amount: 0,
  sales_count: 0,
  methods_breakdown: [],
  [reason]: true,
});

const migrations = [
  {
    version: 1,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version INTEGER PRIMARY KEY,
          applied_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS station_metadata (
          station_id TEXT PRIMARY KEY,
          station_label TEXT,
          tenant_name TEXT,
          device_id TEXT,
          updated_at TEXT NOT NULL
        );
      `);
    },
  },
  {
    version: 2,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS offline_snapshots (
          station_id TEXT PRIMARY KEY,
          schema_version INTEGER NOT NULL,
          snapshot_version TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          payload_sha256 TEXT NOT NULL,
          received_at TEXT NOT NULL
        );
      `);
    },
  },
  {
    version: 3,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS offline_authorizations (
          station_id TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          encrypted_grant TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (station_id, user_id)
        );
      `);
    },
  },
  {
    version: 4,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS offline_sales_outbox (
          id TEXT PRIMARY KEY,
          station_id TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          summary_json TEXT NOT NULL,
          scope_json TEXT,
          state TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_offline_sales_outbox_station_state
          ON offline_sales_outbox (station_id, state, created_at);
      `);
    },
  },
  {
    version: 5,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS offline_sale_receipts (
          offline_sale_id TEXT PRIMARY KEY,
          station_id TEXT NOT NULL,
          sale_id INTEGER NOT NULL,
          sale_number INTEGER,
          document_number TEXT NOT NULL,
          synced_at TEXT NOT NULL,
          sale_json TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_offline_sale_receipts_station_synced
          ON offline_sale_receipts (station_id, synced_at DESC);
      `);
    },
  },
  {
    version: 6,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS offline_customers_outbox (
          id TEXT PRIMARY KEY,
          station_id TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          state TEXT NOT NULL DEFAULT 'pending',
          customer_id INTEGER,
          last_error TEXT,
          sync_attempts INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          synced_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_offline_customers_outbox_station_state
          ON offline_customers_outbox (station_id, state, created_at);
      `);
    },
  },
  {
    version: 7,
    apply(database) {
      database.exec(`
        ALTER TABLE offline_sales_outbox ADD COLUMN last_error TEXT;
        ALTER TABLE offline_sales_outbox ADD COLUMN sync_attempts INTEGER NOT NULL DEFAULT 0;
        ALTER TABLE offline_sales_outbox ADD COLUMN synchronizing_at TEXT;
      `);
    },
  },
  {
    version: 8,
    apply(database) {
      database.exec(`
        ALTER TABLE offline_sales_outbox ADD COLUMN local_closure_id TEXT;

        CREATE TABLE IF NOT EXISTS offline_closures (
          id TEXT PRIMARY KEY,
          station_id TEXT NOT NULL,
          state TEXT NOT NULL DEFAULT 'pending_sync',
          summary_json TEXT NOT NULL,
          details_json TEXT NOT NULL,
          opened_at TEXT,
          closed_at TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          official_closure_id INTEGER,
          official_consecutive TEXT,
          last_error TEXT,
          synced_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_offline_closures_station_state
          ON offline_closures (station_id, state, closed_at DESC);

        CREATE TABLE IF NOT EXISTS offline_closure_sales (
          local_closure_id TEXT NOT NULL,
          offline_sale_id TEXT NOT NULL,
          sale_id INTEGER,
          sale_number INTEGER,
          document_number TEXT,
          synced_at TEXT,
          PRIMARY KEY (local_closure_id, offline_sale_id),
          FOREIGN KEY(local_closure_id) REFERENCES offline_closures(id)
        );
        CREATE INDEX IF NOT EXISTS idx_offline_closure_sales_sale
          ON offline_closure_sales (offline_sale_id);
      `);
    },
  },
  {
    version: 9,
    apply(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS offline_closure_ledger (
          id TEXT PRIMARY KEY,
          station_id TEXT NOT NULL,
          source TEXT NOT NULL,
          summary_json TEXT NOT NULL,
          occurred_at TEXT NOT NULL,
          local_closure_id TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY(local_closure_id) REFERENCES offline_closures(id)
        );
        CREATE INDEX IF NOT EXISTS idx_offline_closure_ledger_station_scope
          ON offline_closure_ledger (station_id, local_closure_id, occurred_at);
      `);
    },
  },
];

class LocalPosStore {
  constructor(userDataPath) {
    this.databasePath = path.join(userDataPath, "offline", "pos.sqlite");
    this.database = null;
    // Copia ya verificada y parseada por estación. Se invalida sola cuando
    // cambia el hash almacenado, así el POS no vuelve a leer, hashear y
    // parsear todo el catálogo en cada consulta.
    this.snapshotCache = new Map();
  }

  initialize(station = {}) {
    fs.mkdirSync(path.dirname(this.databasePath), { recursive: true });
    this.database = new DatabaseSync(this.databasePath);
    this.database.exec("PRAGMA journal_mode = WAL;");
    this.database.exec("PRAGMA foreign_keys = ON;");
    this.database.exec("PRAGMA busy_timeout = 5000;");
    this.applyMigrations();
    this.saveStationMetadata(station);
    return this.getStatus();
  }

  applyMigrations() {
    this.database.exec(
      "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);"
    );
    const appliedRows = this.database.prepare("SELECT version FROM schema_migrations").all();
    const appliedVersions = new Set(appliedRows.map((row) => Number(row.version)));

    for (const migration of migrations) {
      if (appliedVersions.has(migration.version)) continue;
      this.database.exec("BEGIN IMMEDIATE;");
      try {
        migration.apply(this.database);
        this.database
          .prepare("INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)")
          .run(migration.version, new Date().toISOString());
        this.database.exec("COMMIT;");
      } catch (error) {
        this.database.exec("ROLLBACK;");
        throw error;
      }
    }
  }

  saveStationMetadata(station) {
    const stationId = typeof station.stationId === "string" ? station.stationId.trim() : "";
    if (!stationId) return;

    this.database
      .prepare(`
        INSERT INTO station_metadata (
          station_id, station_label, tenant_name, device_id, updated_at
        ) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(station_id) DO UPDATE SET
          station_label = excluded.station_label,
          tenant_name = excluded.tenant_name,
          device_id = excluded.device_id,
          updated_at = excluded.updated_at
      `)
      .run(
        stationId,
        station.stationLabel || null,
        station.tenantName || null,
        station.deviceId || null,
        new Date().toISOString()
      );
  }

  getStatus() {
    if (!this.database) return { available: false, schemaVersion: 0 };
    const row = this.database
      .prepare("SELECT MAX(version) AS version FROM schema_migrations")
      .get();
    const stationCount = this.database
      .prepare("SELECT COUNT(*) AS count FROM station_metadata")
      .get();
    const snapshot = this.database
      .prepare("SELECT snapshot_version, received_at FROM offline_snapshots ORDER BY received_at DESC LIMIT 1")
      .get();
    return {
      available: true,
      schemaVersion: Number(row?.version || 0),
      expectedSchemaVersion: SCHEMA_VERSION,
      stationCount: Number(stationCount?.count || 0),
      snapshotVersion: snapshot?.snapshot_version || null,
      snapshotReceivedAt: snapshot?.received_at || null,
    };
  }

  replaceOfflineSnapshot(snapshot) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const stationId = String(snapshot?.station?.id || "").trim();
    const snapshotVersion = String(snapshot?.snapshot_version || "").trim();
    if (!stationId || !snapshotVersion || !Array.isArray(snapshot?.products)) {
      throw new Error("Snapshot offline inválido");
    }
    const payload = JSON.stringify(snapshot);
    const digest = crypto.createHash("sha256").update(payload).digest("hex");
    this.database.exec("BEGIN IMMEDIATE;");
    try {
      this.database.prepare(`
        INSERT INTO offline_snapshots (
          station_id, schema_version, snapshot_version, payload_json, payload_sha256, received_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(station_id) DO UPDATE SET
          schema_version = excluded.schema_version,
          snapshot_version = excluded.snapshot_version,
          payload_json = excluded.payload_json,
          payload_sha256 = excluded.payload_sha256,
          received_at = excluded.received_at
      `).run(stationId, Number(snapshot.schema_version || 1), snapshotVersion, payload, digest, new Date().toISOString());
      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }
    return this.getStatus();
  }

  getOfflineSnapshot(stationId) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const normalizedStationId = String(stationId || "").trim();
    if (!normalizedStationId) return null;
    const row = this.database.prepare(`
      SELECT snapshot_version, payload_sha256, received_at
      FROM offline_snapshots
      WHERE station_id = ?
      LIMIT 1
    `).get(normalizedStationId);
    if (!row) {
      this.snapshotCache.delete(normalizedStationId);
      return null;
    }
    const cached = this.snapshotCache.get(normalizedStationId);
    if (cached && cached.sha256 === row.payload_sha256 && cached.value.receivedAt === row.received_at) {
      return cached.value;
    }

    const payload = this.database.prepare(
      "SELECT payload_json FROM offline_snapshots WHERE station_id = ? LIMIT 1"
    ).get(normalizedStationId)?.payload_json;
    const text = String(payload || "");
    const digest = crypto.createHash("sha256").update(text).digest("hex");
    if (digest !== row.payload_sha256) {
      throw new Error("El snapshot local no superó la comprobación de integridad");
    }
    let value;
    try {
      value = {
        snapshot: JSON.parse(text),
        snapshotVersion: row.snapshot_version,
        receivedAt: row.received_at,
      };
    } catch {
      throw new Error("El snapshot local está dañado");
    }
    this.snapshotCache.set(normalizedStationId, { sha256: row.payload_sha256, value });
    return value;
  }

  getOfflineSnapshotVersion(stationId) {
    if (!this.database) return null;
    const row = this.database.prepare(
      "SELECT snapshot_version FROM offline_snapshots WHERE station_id = ? LIMIT 1"
    ).get(String(stationId || "").trim());
    return row?.snapshot_version || null;
  }

  saveOfflineAuthorization({ stationId, userId, encryptedGrant, expiresAt }) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    this.database.prepare(`INSERT INTO offline_authorizations
      (station_id, user_id, encrypted_grant, expires_at, updated_at) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(station_id, user_id) DO UPDATE SET encrypted_grant=excluded.encrypted_grant,
      expires_at=excluded.expires_at, updated_at=excluded.updated_at`).run(
      String(stationId), Number(userId), String(encryptedGrant), String(expiresAt), new Date().toISOString()
    );
  }

  // Reemplaza todas las autorizaciones de la estación por las vigentes: un
  // usuario desactivado o un PIN cambiado deja de servir en la siguiente
  // renovación en línea.
  replaceOfflineAuthorizations(stationId, records) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const normalizedStationId = String(stationId || "").trim();
    if (!normalizedStationId) throw new Error("Estación inválida");
    const now = new Date().toISOString();
    this.database.exec("BEGIN IMMEDIATE;");
    try {
      this.database.prepare("DELETE FROM offline_authorizations WHERE station_id = ?").run(normalizedStationId);
      const insert = this.database.prepare(`INSERT INTO offline_authorizations
        (station_id, user_id, encrypted_grant, expires_at, updated_at) VALUES (?, ?, ?, ?, ?)`);
      for (const record of records) {
        insert.run(normalizedStationId, Number(record.userId), String(record.encryptedGrant), String(record.expiresAt), now);
      }
      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }
    return records.length;
  }

  getOfflineAuthorizations(stationId) {
    if (!this.database) return [];
    return this.database.prepare(`SELECT station_id, user_id, encrypted_grant, expires_at
      FROM offline_authorizations WHERE station_id = ? AND expires_at > ? ORDER BY updated_at DESC`).all(
      String(stationId), new Date().toISOString()
    );
  }

  enqueueOfflineSale({ id, stationId, payload, summary, scope }) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const saleId = String(id || "").trim();
    const normalizedStationId = String(stationId || "").trim();
    if (!saleId || !normalizedStationId) throw new Error("Venta offline inválida");
    // Idempotente: una venta ya encolada o ya confirmada por el servidor nunca
    // se vuelve a insertar (un espejo viejo del renderer podría resucitarla).
    if (this.hasOfflineSale(saleId)) return this.getOfflineSales(normalizedStationId);
    const pending = this.getOfflineSales(normalizedStationId);
    if (pending.length >= OFFLINE_SALES_MAX_COUNT) {
      throw new Error(`Se alcanzó el límite de ${OFFLINE_SALES_MAX_COUNT} ventas offline. Sincroniza antes de continuar.`);
    }
    const pendingTotal = pending.reduce(
      (total, record) => total + Math.max(0, Number(record?.summary?.total) || 0),
      0
    );
    const nextTotal = Math.max(0, Number(summary?.total) || 0);
    if (pendingTotal + nextTotal > OFFLINE_SALES_MAX_TOTAL) {
      throw new Error("Esta venta supera el límite acumulado de $25.000.000 COP offline. Sincroniza antes de continuar.");
    }
    const now = new Date().toISOString();
    this.database.prepare(`INSERT INTO offline_sales_outbox
      (id, station_id, payload_json, summary_json, scope_json, state, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
      ON CONFLICT(id) DO NOTHING`).run(
      saleId,
      normalizedStationId,
      JSON.stringify(payload || {}),
      JSON.stringify(summary || {}),
      scope ? JSON.stringify(scope) : null,
      now,
      now
    );
    return this.getOfflineSales(normalizedStationId);
  }

  hasOfflineSale(id) {
    if (!this.database) return false;
    const saleId = String(id || "").trim();
    if (!saleId) return false;
    return Boolean(
      this.database.prepare("SELECT 1 FROM offline_sales_outbox WHERE id = ? LIMIT 1").get(saleId) ||
      this.database.prepare("SELECT 1 FROM offline_sale_receipts WHERE offline_sale_id = ? LIMIT 1").get(saleId)
    );
  }

  getOfflineSales(stationId) {
    if (!this.database) return [];
    return this.database.prepare(`SELECT id, payload_json, summary_json, scope_json, state, last_error, sync_attempts, created_at, local_closure_id
      FROM offline_sales_outbox WHERE station_id = ? AND state IN ('pending', 'syncing', 'failed') ORDER BY created_at ASC`).all(
      String(stationId || "")
    ).flatMap((row) => {
      try {
        return [{
          id: row.id,
          endpoint: "/pos/sales",
          payload: JSON.parse(row.payload_json),
          summary: JSON.parse(row.summary_json),
          scope: row.scope_json ? JSON.parse(row.scope_json) : undefined,
          state: row.state,
          lastError: row.last_error || null,
          syncAttempts: Number(row.sync_attempts || 0),
          localClosureId: row.local_closure_id || null,
        }];
      } catch {
        return [];
      }
    });
  }

  removeOfflineSale(id) {
    if (!this.database) return;
    this.database.prepare("DELETE FROM offline_sales_outbox WHERE id = ?").run(String(id || ""));
  }

  updateOfflineSale(id, { payload, summary }) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const saleId = String(id || "").trim();
    if (!saleId) throw new Error("Venta offline inválida");
    const current = this.database.prepare(`SELECT payload_json, summary_json
      FROM offline_sales_outbox WHERE id = ? LIMIT 1`).get(saleId);
    if (!current) return false;
    this.database.prepare(`UPDATE offline_sales_outbox
      SET payload_json = ?, summary_json = ?, updated_at = ? WHERE id = ?`).run(
      JSON.stringify(payload ?? JSON.parse(current.payload_json)),
      JSON.stringify(summary ?? JSON.parse(current.summary_json)),
      new Date().toISOString(),
      saleId
    );
    return true;
  }

  markOfflineSaleSyncing(id) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const saleId = String(id || "").trim();
    if (!saleId) return false;
    const result = this.database.prepare(`UPDATE offline_sales_outbox
      SET state = 'syncing', last_error = NULL, sync_attempts = sync_attempts + 1,
      synchronizing_at = ?, updated_at = ? WHERE id = ?`).run(
      new Date().toISOString(), new Date().toISOString(), saleId
    );
    return result.changes > 0;
  }

  markOfflineSalePending(id, error) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const saleId = String(id || "").trim();
    if (!saleId) return false;
    const result = this.database.prepare(`UPDATE offline_sales_outbox
      SET state = 'pending', last_error = ?, synchronizing_at = NULL, updated_at = ? WHERE id = ?`).run(
      error ? String(error).slice(0, 1000) : null,
      new Date().toISOString(),
      saleId
    );
    return result.changes > 0;
  }

  recordClosureLedgerSale({ id, stationId, summary, occurredAt }) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const recordId = String(id || "").trim();
    const normalizedStationId = String(stationId || "").trim();
    if (!recordId || !normalizedStationId) throw new Error("Movimiento de cierre inválido");
    const now = new Date().toISOString();
    this.database.prepare(`INSERT INTO offline_closure_ledger
      (id, station_id, source, summary_json, occurred_at, created_at, updated_at)
      VALUES (?, ?, 'online', ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        summary_json = excluded.summary_json,
        occurred_at = excluded.occurred_at,
        updated_at = excluded.updated_at`).run(
      recordId,
      normalizedStationId,
      JSON.stringify(summary || {}),
      String(occurredAt || now),
      now,
      now
    );
    return true;
  }

  getOfflineClosurePreview(stationId, closedAt) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const normalizedStationId = String(stationId || "").trim();
    const cutoff = String(closedAt || new Date().toISOString());
    const localSnapshot = this.getOfflineSnapshot(normalizedStationId);
    const snapshotBaseline = localSnapshot?.snapshot?.closure_baseline;
    let baseline = snapshotBaseline;
    let baselineCapturedAt = String(snapshotBaseline?.captured_at || localSnapshot?.snapshot?.generated_at || localSnapshot?.receivedAt || "");
    if (!baselineCapturedAt) {
      throw new Error("No hay un corte local válido para cerrar sin conexión. Conecta y actualiza la copia antes de usar este cierre.");
    }
    const latestLocalClosure = this.database.prepare(`SELECT closed_at FROM offline_closures
      WHERE station_id = ? AND closed_at <= ? ORDER BY closed_at DESC LIMIT 1`).get(
      normalizedStationId, cutoff
    );
    // Si hubo un cierre local después del último snapshot, ese cierre es el
    // nuevo inicio de turno. No volvemos a sumar la mañana anterior mientras
    // el equipo siga aislado y todavía no exista un corte nuevo del servidor.
    if (latestLocalClosure?.closed_at && String(latestLocalClosure.closed_at) > baselineCapturedAt) {
      baselineCapturedAt = String(latestLocalClosure.closed_at);
      baseline = emptyClosureBaseline("reset_from_local_closure");
    }
    // El cierre es por día de Bogotá, igual que en el servidor. Si el último
    // corte es de un día anterior (por ejemplo, se abrió sin internet y la
    // última sincronización fue ayer), lo de ayer no pertenece a este cierre.
    const dayStart = bogotaDayStartIso(cutoff);
    if (baselineCapturedAt < dayStart) {
      baselineCapturedAt = dayStart;
      baseline = emptyClosureBaseline("reset_from_previous_day");
    }

    const ledgerRows = this.database.prepare(`SELECT id, summary_json, occurred_at
      FROM offline_closure_ledger
      WHERE station_id = ? AND local_closure_id IS NULL AND occurred_at > ? AND occurred_at <= ?
      ORDER BY occurred_at ASC`).all(normalizedStationId, baselineCapturedAt, cutoff);
    const pendingRows = this.database.prepare(`SELECT id, payload_json, summary_json, created_at
      FROM offline_sales_outbox
      WHERE station_id = ? AND local_closure_id IS NULL
      AND state IN ('pending', 'syncing', 'failed') AND created_at >= ? AND created_at <= ?
      ORDER BY created_at ASC`).all(normalizedStationId, dayStart, cutoff);

    const emptyMethods = () => ({ cash: 0, card: 0, qr: 0, nequi: 0, daviplata: 0, credit: 0, other: {} });
    const methodTotals = emptyMethods();
    const baselineMethods = baseline?.methods_breakdown;
    const addMethod = (method, amount) => {
      const normalizedAmount = Math.max(0, Number(amount) || 0);
      if (!normalizedAmount) return;
      const value = String(method || "").toLowerCase();
      if (value.includes("efectivo") || value === "cash") methodTotals.cash += normalizedAmount;
      else if (value.includes("datáfono") || value.includes("datafono") || value.includes("tarjeta") || value === "card") methodTotals.card += normalizedAmount;
      else if (value.includes("nequi")) methodTotals.nequi += normalizedAmount;
      else if (value.includes("daviplata")) methodTotals.daviplata += normalizedAmount;
      else if (value.includes("crédito") || value.includes("credito") || value.includes("separado") || value === "credit") methodTotals.credit += normalizedAmount;
      else if (value.includes("transfer") || value.includes("qr") || value.includes("bancolombia")) methodTotals.qr += normalizedAmount;
      else {
        const label = String(method || "Otro").trim() || "Otro";
        methodTotals.other[label] = (methodTotals.other[label] || 0) + normalizedAmount;
      }
    };
    if (Array.isArray(baselineMethods) && baselineMethods.length > 0) {
      for (const method of baselineMethods) addMethod(method?.label || method?.key, method?.net ?? method?.gross);
    } else {
      methodTotals.cash = Number(baseline?.total_cash || 0);
      methodTotals.card = Number(baseline?.total_card || 0);
      methodTotals.qr = Number(baseline?.total_qr || 0);
      methodTotals.nequi = Number(baseline?.total_nequi || 0);
      methodTotals.daviplata = Number(baseline?.total_daviplata || 0);
      methodTotals.credit = Number(baseline?.total_credit || 0);
    }

    const isCashMethod = (method) => {
      const value = String(method || "").toLowerCase();
      return value === "cash" || value.includes("efectivo");
    };
    const addSalePayments = (payload, summary) => {
      const payments = Array.isArray(payload?.payments) ? payload.payments : [];
      const total = Math.max(0, Number(summary?.total ?? payload?.total) || 0);
      if (payments.length > 0) {
        // Los pagos guardan lo entregado; el cambio sale del efectivo. Igual
        // que el cierre del servidor, el desglose suma solo lo cobrado.
        const tendered = payments.reduce((sum, payment) => sum + Math.max(0, Number(payment?.amount) || 0), 0);
        let change = total > 0 ? Math.max(0, tendered - total) : 0;
        for (const payment of payments) {
          let amount = Math.max(0, Number(payment?.amount) || 0);
          if (change > 0 && isCashMethod(payment?.method)) {
            const deducted = Math.min(change, amount);
            amount -= deducted;
            change -= deducted;
          }
          addMethod(payment?.method, amount);
        }
      } else {
        addMethod(payload?.payment_method || summary?.methodLabel, total || payload?.paid_amount);
      }
    };
    const ledger = ledgerRows.flatMap((row) => {
      try {
        const summary = JSON.parse(row.summary_json);
        addSalePayments(summary?.payload, summary);
        return [{ id: row.id, summary, occurredAt: row.occurred_at, source: "online" }];
      } catch { return []; }
    });
    const pendingSales = pendingRows.flatMap((row) => {
      try {
        const payload = JSON.parse(row.payload_json);
        const summary = JSON.parse(row.summary_json);
        addSalePayments(payload, summary);
        return [{ id: row.id, summary, payload, occurredAt: payload?.offline_captured_at || row.created_at, source: "offline" }];
      } catch { return []; }
    });
    const totalOf = (entries) => entries.reduce((total, entry) => total + Math.max(0, Number(entry?.summary?.total ?? entry?.payload?.total ?? 0) || 0), 0);
    const baselineTotal = Math.max(0, Number(baseline?.total_amount || 0));
    const baselineCount = Math.max(0, Number(baseline?.sales_count || 0));
    const localEntries = [...ledger, ...pendingSales];
    const methodsBreakdown = [
      ["Efectivo", methodTotals.cash], ["Tarjeta Datáfono", methodTotals.card],
      ["Transferencias / QR", methodTotals.qr], ["Nequi", methodTotals.nequi],
      ["Daviplata", methodTotals.daviplata], ["Crédito / separado", methodTotals.credit],
      ...Object.entries(methodTotals.other),
    ].filter(([, amount]) => Number(amount) !== 0).map(([label, amount]) => ({ label, gross: Number(amount), refunds: 0, net: Number(amount) }));
    const totalAmount = baselineTotal + totalOf(localEntries);
    return {
      stationId: normalizedStationId,
      baselineCapturedAt,
      closedAt: cutoff,
      summary: {
        totalAmount,
        totalCash: methodTotals.cash,
        totalCard: methodTotals.card,
        totalQr: methodTotals.qr,
        totalNequi: methodTotals.nequi,
        totalDaviplata: methodTotals.daviplata,
        totalCredit: methodTotals.credit,
        totalRefunds: Math.max(0, Number(baseline?.total_refunds || 0)),
        netAmount: totalAmount - Math.max(0, Number(baseline?.total_refunds || 0)),
        salesCount: baselineCount + localEntries.length,
        methodsBreakdown,
      },
      details: {
        baseline,
        baselineCapturedAt,
        onlineSales: ledger,
        offlineSales: pendingSales,
      },
    };
  }

  createOfflineClosure({ id, stationId, summary, details, openedAt, closedAt }) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const closureId = String(id || crypto.randomUUID()).trim();
    const normalizedStationId = String(stationId || "").trim();
    const closingTime = String(closedAt || new Date().toISOString());
    if (!closureId || !normalizedStationId) throw new Error("Cierre de contingencia inválido");

    const existing = this.database.prepare(
      "SELECT id FROM offline_closures WHERE id = ? LIMIT 1"
    ).get(closureId);
    if (existing) return this.getOfflineClosure(closureId);

    // Nunca antes del inicio del día de Bogotá del cierre (ver la vista previa).
    const closingDayStart = bogotaDayStartIso(closingTime);
    const sales = this.database.prepare(`SELECT id FROM offline_sales_outbox
      WHERE station_id = ? AND local_closure_id IS NULL
      AND state IN ('pending', 'syncing', 'failed') AND created_at >= ? AND created_at <= ?
      ORDER BY created_at ASC`).all(normalizedStationId, closingDayStart, closingTime);
    const requestedBaseline = String(details?.baselineCapturedAt || "");
    const baselineCapturedAt = requestedBaseline > closingDayStart ? requestedBaseline : closingDayStart;
    const ledgerSales = this.database.prepare(`SELECT id FROM offline_closure_ledger
      WHERE station_id = ? AND local_closure_id IS NULL
      ${baselineCapturedAt ? "AND occurred_at > ?" : ""} AND occurred_at <= ?
      ORDER BY occurred_at ASC`).all(
        ...(baselineCapturedAt
          ? [normalizedStationId, baselineCapturedAt, closingTime]
          : [normalizedStationId, closingTime])
      );
    if (sales.length === 0 && ledgerSales.length === 0 && Number(summary?.salesCount || 0) <= 0) {
      throw new Error("No hay ventas para incluir en este cierre de contingencia.");
    }

    const now = new Date().toISOString();
    this.database.exec("BEGIN IMMEDIATE;");
    try {
      this.database.prepare(`INSERT INTO offline_closures
        (id, station_id, state, summary_json, details_json, opened_at, closed_at, created_at, updated_at)
        VALUES (?, ?, 'pending_sync', ?, ?, ?, ?, ?, ?)`)
        .run(
          closureId,
          normalizedStationId,
          JSON.stringify(summary || {}),
          JSON.stringify({
            ...(details || {}),
            saleRequestIds: sales.map((sale) => sale.id),
            onlineSaleIds: ledgerSales.map((sale) => sale.id),
          }),
          openedAt || null,
          closingTime,
          now,
          now
        );
      const setSaleClosure = this.database.prepare(
        "UPDATE offline_sales_outbox SET local_closure_id = ?, updated_at = ? WHERE id = ?"
      );
      const insertClosureSale = this.database.prepare(`INSERT INTO offline_closure_sales
        (local_closure_id, offline_sale_id) VALUES (?, ?)`);
      for (const sale of sales) {
        setSaleClosure.run(closureId, now, sale.id);
        insertClosureSale.run(closureId, sale.id);
      }
      const setLedgerClosure = this.database.prepare(
        "UPDATE offline_closure_ledger SET local_closure_id = ?, updated_at = ? WHERE id = ?"
      );
      for (const sale of ledgerSales) setLedgerClosure.run(closureId, now, sale.id);
      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }
    return this.getOfflineClosure(closureId);
  }

  getOfflineClosure(id) {
    if (!this.database) return null;
    const row = this.database.prepare(`SELECT * FROM offline_closures WHERE id = ? LIMIT 1`).get(String(id || ""));
    if (!row) return null;
    const sales = this.database.prepare(`SELECT offline_sale_id, sale_id, sale_number, document_number, synced_at
      FROM offline_closure_sales WHERE local_closure_id = ? ORDER BY offline_sale_id ASC`).all(row.id);
    try {
      return {
        id: row.id,
        stationId: row.station_id,
        state: row.state,
        summary: JSON.parse(row.summary_json),
        details: JSON.parse(row.details_json),
        openedAt: row.opened_at || null,
        closedAt: row.closed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        officialClosureId: row.official_closure_id == null ? null : Number(row.official_closure_id),
        officialConsecutive: row.official_consecutive || null,
        lastError: row.last_error || null,
        syncedAt: row.synced_at || null,
        sales: sales.map((sale) => ({
          offlineSaleId: sale.offline_sale_id,
          saleId: sale.sale_id == null ? null : Number(sale.sale_id),
          saleNumber: sale.sale_number == null ? null : Number(sale.sale_number),
          documentNumber: sale.document_number || null,
          syncedAt: sale.synced_at || null,
        })),
      };
    } catch {
      throw new Error("El cierre de contingencia local está dañado");
    }
  }

  getOfflineClosures(stationId, options = {}) {
    if (!this.database) return [];
    const includeFinalized = Boolean(options.includeFinalized);
    const rows = this.database.prepare(`SELECT id FROM offline_closures
      WHERE station_id = ? ${includeFinalized ? "" : "AND state != 'official'"}
      ORDER BY closed_at DESC`).all(String(stationId || ""));
    return rows.map((row) => this.getOfflineClosure(row.id)).filter(Boolean);
  }

  markOfflineClosureSyncing(id) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const result = this.database.prepare(`UPDATE offline_closures
      SET state = 'syncing', last_error = NULL, updated_at = ? WHERE id = ?`).run(
      new Date().toISOString(), String(id || "")
    );
    return result.changes > 0;
  }

  markOfflineClosurePending(id, error) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const result = this.database.prepare(`UPDATE offline_closures
      SET state = 'pending_sync', last_error = ?, updated_at = ? WHERE id = ?`).run(
      error ? String(error).slice(0, 1000) : null,
      new Date().toISOString(), String(id || "")
    );
    return result.changes > 0;
  }

  completeOfflineClosure(id, closure) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const officialClosureId = Number(closure?.id);
    if (!Number.isInteger(officialClosureId) || officialClosureId <= 0) {
      throw new Error("El servidor no devolvió un cierre oficial válido");
    }
    const result = this.database.prepare(`UPDATE offline_closures SET
      state = 'official', official_closure_id = ?, official_consecutive = ?, last_error = NULL,
      synced_at = ?, updated_at = ? WHERE id = ?`).run(
      officialClosureId,
      closure?.consecutive ? String(closure.consecutive) : null,
      new Date().toISOString(), new Date().toISOString(), String(id || "")
    );
    return result.changes > 0;
  }

  enqueueOfflineCustomer({ id, stationId, payload }) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const customerId = String(id || "").trim();
    const normalizedStationId = String(stationId || "").trim();
    if (!customerId || !normalizedStationId || !payload?.name) {
      throw new Error("Cliente offline inválido");
    }
    const now = new Date().toISOString();
    this.database.prepare(`INSERT INTO offline_customers_outbox
      (id, station_id, payload_json, state, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        payload_json = excluded.payload_json,
        updated_at = excluded.updated_at,
        state = CASE WHEN offline_customers_outbox.customer_id IS NULL THEN 'pending' ELSE offline_customers_outbox.state END`).run(
      customerId, normalizedStationId, JSON.stringify(payload), now, now
    );
    return this.getOfflineCustomers(normalizedStationId);
  }

  getOfflineCustomers(stationId, options = {}) {
    if (!this.database) return [];
    const includeSynced = Boolean(options.includeSynced);
    const states = includeSynced ? "('pending', 'syncing', 'failed', 'confirmed')" : "('pending', 'syncing', 'failed')";
    return this.database.prepare(`SELECT id, payload_json, state, customer_id, last_error, sync_attempts, created_at, synced_at
      FROM offline_customers_outbox WHERE station_id = ? AND state IN ${states} ORDER BY created_at DESC`).all(
      String(stationId || "")
    ).flatMap((row) => {
      try {
        return [{
          id: row.id,
          ...JSON.parse(row.payload_json),
          state: row.state,
          syncedCustomerId: row.customer_id == null ? undefined : Number(row.customer_id),
          lastError: row.last_error || null,
          syncAttempts: Number(row.sync_attempts || 0),
          createdAt: row.created_at,
          syncedAt: row.synced_at || null,
        }];
      } catch {
        return [];
      }
    });
  }

  markOfflineCustomerSyncing(id) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const result = this.database.prepare(`UPDATE offline_customers_outbox
      SET state = 'syncing', last_error = NULL, sync_attempts = sync_attempts + 1, updated_at = ? WHERE id = ?`).run(
      new Date().toISOString(), String(id || "")
    );
    return result.changes > 0;
  }

  completeOfflineCustomer(id, customerId) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const parsedCustomerId = Number(customerId);
    if (!Number.isInteger(parsedCustomerId) || parsedCustomerId <= 0) {
      throw new Error("El cliente sincronizado no es válido");
    }
    const now = new Date().toISOString();
    const result = this.database.prepare(`UPDATE offline_customers_outbox
      SET state = 'confirmed', customer_id = ?, last_error = NULL, synced_at = ?, updated_at = ? WHERE id = ?`).run(
      parsedCustomerId, now, now, String(id || "")
    );
    return result.changes > 0;
  }

  markOfflineCustomerPending(id, error) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const result = this.database.prepare(`UPDATE offline_customers_outbox
      SET state = 'pending', last_error = ?, updated_at = ? WHERE id = ?`).run(
      error ? String(error).slice(0, 1000) : null,
      new Date().toISOString(), String(id || "")
    );
    return result.changes > 0;
  }

  completeOfflineSale(id, sale) {
    if (!this.database) throw new Error("Almacenamiento local no inicializado");
    const offlineSaleId = String(id || "").trim();
    const saleId = Number(sale?.id);
    const documentNumber = String(sale?.document_number || "").trim();
    if (!offlineSaleId || !Number.isInteger(saleId) || saleId <= 0 || !documentNumber) {
      throw new Error("La venta sincronizada no tiene documento oficial válido");
    }
    const pending = this.database.prepare(`SELECT station_id, local_closure_id, payload_json, summary_json
      FROM offline_sales_outbox WHERE id = ? LIMIT 1`).get(offlineSaleId);
    if (!pending) return false;
    const now = new Date().toISOString();
    let ledgerSummary = null;
    try {
      const payload = JSON.parse(pending.payload_json || "{}");
      const summary = JSON.parse(pending.summary_json || "{}");
      ledgerSummary = {
        total: Number(summary?.total ?? sale?.total ?? payload?.total) || 0,
        payload: {
          payments: Array.isArray(payload?.payments) ? payload.payments : [],
          payment_method: payload?.payment_method ?? null,
          paid_amount: payload?.paid_amount ?? null,
        },
        saleId,
        documentNumber,
      };
    } catch {
      ledgerSummary = { total: Number(sale?.total) || 0, payload: {}, saleId, documentNumber };
    }
    // La venta ya existe en el servidor, pero el corte del snapshot local puede
    // ser anterior. Se registra en el libro del cierre con la hora en que el
    // servidor la recibió (su reloj, como el corte): un corte posterior ya la
    // incluye y la excluye; uno anterior la suma. Si ya pertenece a un cierre
    // de contingencia, queda ligada a él para no contarla dos veces.
    const ledgerOccurredAt = String(sale?.offline_synced_at || now);
    this.database.exec("BEGIN IMMEDIATE;");
    try {
      this.database.prepare(`INSERT INTO offline_closure_ledger
        (id, station_id, source, summary_json, occurred_at, local_closure_id, created_at, updated_at)
        VALUES (?, ?, 'offline_synced', ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING`).run(
        `offline-${offlineSaleId}`,
        pending.station_id,
        JSON.stringify(ledgerSummary),
        ledgerOccurredAt,
        pending.local_closure_id || null,
        now,
        now
      );
      this.database.prepare(`INSERT INTO offline_sale_receipts
        (offline_sale_id, station_id, sale_id, sale_number, document_number, synced_at, sale_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(offline_sale_id) DO UPDATE SET
          sale_id = excluded.sale_id,
          sale_number = excluded.sale_number,
          document_number = excluded.document_number,
          synced_at = excluded.synced_at,
          sale_json = excluded.sale_json`).run(
        offlineSaleId,
        pending.station_id,
        saleId,
        Number.isInteger(Number(sale.sale_number)) ? Number(sale.sale_number) : null,
        documentNumber,
        now,
        JSON.stringify(sale)
      );
      if (pending.local_closure_id) {
        this.database.prepare(`UPDATE offline_closure_sales SET
          sale_id = ?, sale_number = ?, document_number = ?, synced_at = ?
          WHERE local_closure_id = ? AND offline_sale_id = ?`).run(
          saleId,
          Number.isInteger(Number(sale.sale_number)) ? Number(sale.sale_number) : null,
          documentNumber,
          now,
          pending.local_closure_id,
          offlineSaleId
        );
      }
      this.database.prepare("DELETE FROM offline_sales_outbox WHERE id = ?").run(offlineSaleId);
      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }
    return {
      offlineSaleId,
      saleId,
      saleNumber: Number.isInteger(Number(sale.sale_number)) ? Number(sale.sale_number) : null,
      documentNumber,
      syncedAt: now,
    };
  }

  close() {
    this.snapshotCache.clear();
    if (!this.database) return;
    this.database.close();
    this.database = null;
  }
}

module.exports = { LocalPosStore, SCHEMA_VERSION };
