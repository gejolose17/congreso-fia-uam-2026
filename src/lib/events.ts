import { EventEmitter } from "node:events";

const globalForEvents = globalThis as unknown as {
  __fiaDashboardEmitter?: EventEmitter;
};

export const dashboardEmitter =
  globalForEvents.__fiaDashboardEmitter ?? new EventEmitter();

dashboardEmitter.setMaxListeners(200);
globalForEvents.__fiaDashboardEmitter = dashboardEmitter;

export function notifyDashboardUpdate() {
  dashboardEmitter.emit("update", { ts: Date.now() });
}

