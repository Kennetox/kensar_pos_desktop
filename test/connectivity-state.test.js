const test = require("node:test");
const assert = require("node:assert/strict");
const { createConnectivityState, isApiUnavailableState } = require("../connectivity-state");

const success = { type: "success" };
const networkFailure = { type: "failure", kind: "network" };
const httpFailure = { type: "failure", kind: "http" };

const run = (machine, events) => events.map((event) => machine.apply(event).state);

test("arranca en checking y pasa a healthy con la primera respuesta", () => {
  const machine = createConnectivityState();
  assert.equal(machine.state, "checking");
  assert.deepEqual(run(machine, [success]), ["healthy"]);
});

test("un fallo aislado vuelve a healthy sin pasar por recovering", () => {
  const machine = createConnectivityState();
  assert.deepEqual(run(machine, [success, networkFailure, success]), ["healthy", "reconnecting", "healthy"]);
});

test("tres fallos consecutivos confirman la caída de red", () => {
  const machine = createConnectivityState();
  assert.deepEqual(
    run(machine, [success, networkFailure, networkFailure, networkFailure]),
    ["healthy", "reconnecting", "reconnecting", "connection"]
  );
});

test("errores HTTP confirmados se reportan como degraded", () => {
  const machine = createConnectivityState();
  assert.deepEqual(run(machine, [httpFailure, httpFailure, httpFailure]), ["reconnecting", "reconnecting", "degraded"]);
});

test("tras una caída confirmada exige dos lecturas sanas", () => {
  const machine = createConnectivityState();
  run(machine, [networkFailure, networkFailure, networkFailure]);
  assert.deepEqual(run(machine, [success, success]), ["recovering", "healthy"]);
});

test("un fallo durante recovering regresa a la caída sin oscilar por reconnecting", () => {
  const machine = createConnectivityState();
  run(machine, [networkFailure, networkFailure, networkFailure, success]);
  assert.equal(machine.state, "recovering");
  assert.deepEqual(run(machine, [networkFailure]), ["connection"]);
  assert.deepEqual(run(machine, [success, success]), ["recovering", "healthy"]);
});

test("un sondeo inconcluso no altera el estado ni los contadores", () => {
  const machine = createConnectivityState();
  run(machine, [success, networkFailure, networkFailure]);
  for (let i = 0; i < 10; i += 1) machine.apply({ type: "inconclusive" });
  assert.equal(machine.state, "reconnecting");
  // Sigue faltando un único fallo real para confirmar la caída.
  assert.deepEqual(run(machine, [networkFailure]), ["connection"]);
});

test("mantenimiento persiste ante fallos y termina con una respuesta sana", () => {
  const machine = createConnectivityState();
  assert.deepEqual(
    run(machine, [success, { type: "maintenance" }, networkFailure, httpFailure, success]),
    ["healthy", "maintenance", "maintenance", "maintenance", "healthy"]
  );
});

test("solo las caídas confirmadas limitan la operación del POS", () => {
  for (const state of ["checking", "healthy", "reconnecting"]) assert.equal(isApiUnavailableState(state), false, state);
  for (const state of ["connection", "degraded", "recovering", "maintenance"]) assert.equal(isApiUnavailableState(state), true, state);
});
