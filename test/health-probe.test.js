const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const net = require("net");
const { fetchLoopbackHealth } = require("../health-probe");
const { createConnectivityState } = require("../connectivity-state");

const listen = (server, port = 0) => new Promise((resolve) => {
  server.listen(port, "127.0.0.1", () => resolve(server.address().port));
});
const close = (server) => new Promise((resolve) => server.close(() => resolve()));
const healthServer = () => {
  const server = http.createServer((_request, response) => {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ status: "ok", maintenance: false }));
  });
  // Igual que Uvicorn: cierra rápido las conexiones ociosas.
  server.keepAliveTimeout = 50;
  return server;
};

test("cada sondeo usa una conexión nueva (sin socket reutilizado)", async () => {
  const server = healthServer();
  let connections = 0;
  server.on("connection", () => { connections += 1; });
  const port = await listen(server);
  const url = `http://127.0.0.1:${port}/healthz`;
  try {
    for (let i = 0; i < 6; i += 1) {
      const response = await fetchLoopbackHealth(url);
      assert.equal(response.ok, true);
      assert.deepEqual(await response.json(), { status: "ok", maintenance: false });
      // Deja que el servidor cierre el socket ocioso entre sondeos, que es la
      // condición que producía `read ECONNRESET` con el agente keep-alive.
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  } finally {
    server.closeAllConnections?.();
    await close(server);
  }
  assert.equal(connections, 6);
});

test("aborta a tiempo cuando el servidor acepta pero no responde", async () => {
  const sockets = new Set();
  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on("error", () => {});
  });
  const port = await listen(server);
  const controller = new AbortController();
  const startedAt = Date.now();
  setTimeout(() => controller.abort(), 200);
  try {
    await assert.rejects(fetchLoopbackHealth(`http://127.0.0.1:${port}/healthz`, controller.signal), (error) => {
      assert.equal(error.name, "AbortError");
      assert.ok(error.phases && "socket" in error.phases);
      return true;
    });
    assert.ok(Date.now() - startedAt < 1_000);
  } finally {
    for (const socket of sockets) socket.destroy();
    await close(server);
  }
});

test("backend caído y recuperado: la máquina confirma la caída y la recuperación", async () => {
  const machine = createConnectivityState();
  let server = healthServer();
  const port = await listen(server);
  const url = `http://127.0.0.1:${port}/healthz`;
  const probe = async () => {
    try {
      const response = await fetchLoopbackHealth(url);
      return machine.apply(response.ok ? { type: "success" } : { type: "failure", kind: "http" }).state;
    } catch (error) {
      assert.equal(error.code, "ECONNREFUSED");
      return machine.apply({ type: "failure", kind: "network" }).state;
    }
  };

  assert.equal(await probe(), "healthy");
  server.closeAllConnections?.();
  await close(server);
  assert.deepEqual([await probe(), await probe(), await probe()], ["reconnecting", "reconnecting", "connection"]);

  server = healthServer();
  await listen(server, port);
  try {
    assert.deepEqual([await probe(), await probe()], ["recovering", "healthy"]);
  } finally {
    server.closeAllConnections?.();
    await close(server);
  }
});
