// Máquina de estados de conectividad del POS.
//
// Solo el monitor del proceso principal la alimenta (main.js); preload y React
// consumen el estado resultante y nunca lo emiten.
//
//   checking      arranque, aún sin una lectura.
//   healthy       la API responde.
//   reconnecting  fallos aislados por debajo del umbral. La caja sigue online.
//   connection    caída confirmada por red/timeout. La caja opera offline.
//   degraded      caída confirmada: la API responde con error HTTP.
//   recovering    tras una caída confirmada, la API volvió a responder pero
//                 aún no suma las lecturas sanas necesarias. Sigue offline.
//   maintenance   el backend anunció mantenimiento.
//
// Un fallo aislado nunca pasa por "recovering": la caída no llegó a
// confirmarse, así que una respuesta sana basta para volver a "healthy".

const OUTAGE_STATES = new Set(["connection", "degraded"]);
// Estados en los que el POS limita operaciones y usa la copia local.
const API_UNAVAILABLE_STATES = new Set(["connection", "degraded", "recovering", "maintenance"]);

const isApiUnavailableState = (state) => API_UNAVAILABLE_STATES.has(state);

const createConnectivityState = ({ failuresToOpen = 3, successesToClose = 2 } = {}) => {
  let state = "checking";
  let failures = 0;
  let successes = 0;

  const transition = (next) => {
    const previous = state;
    state = next;
    return { state, previous, changed: previous !== next, failures, successes };
  };

  const apply = (event) => {
    switch (event?.type) {
      case "maintenance":
        failures = 0;
        successes = 0;
        return transition("maintenance");
      case "success": {
        failures = 0;
        if (OUTAGE_STATES.has(state) || state === "recovering") {
          successes += 1;
          return transition(successes >= successesToClose ? "healthy" : "recovering");
        }
        successes = 0;
        return transition("healthy");
      }
      case "failure": {
        successes = 0;
        // Durante mantenimiento el backend puede reiniciarse; seguimos
        // mostrando mantenimiento hasta una respuesta sana sin esa marca.
        if (state === "maintenance") return transition("maintenance");
        const outage = event.kind === "http" ? "degraded" : "connection";
        if (OUTAGE_STATES.has(state) || state === "recovering") {
          failures = Math.max(failures + 1, failuresToOpen);
          return transition(outage);
        }
        failures += 1;
        return transition(failures >= failuresToOpen ? outage : "reconnecting");
      }
      default:
        // "inconclusive": el sondeo no aporta evidencia sobre la API (por
        // ejemplo, el proceso estuvo suspendido y el timeout venció tarde).
        return transition(state);
    }
  };

  return {
    apply,
    get state() { return state; },
  };
};

module.exports = { createConnectivityState, isApiUnavailableState, API_UNAVAILABLE_STATES };
