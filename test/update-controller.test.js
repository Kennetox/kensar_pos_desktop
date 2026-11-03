const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createUpdateController } = require('../update-controller');
function fixture(supported = true) {
  const updater = new EventEmitter();
  let calls = 0, installs = 0, tick;
  updater.checkForUpdates = async () => { calls++; updater.emit('checking-for-update'); };
  const controller = createUpdateController({ updater, supported, version: '1.0.17', publish() {},
    install() { installs++; }, timers: { setInterval(fn) { tick = fn; return 1; }, clearInterval() { tick = null; } } });
  return { updater, controller, calls: () => calls, installs: () => installs, tick: () => tick?.() };
}
test('development does not check or install', async () => {
  const f = fixture(false); await f.controller.check(); f.controller.scheduleInstall();
  assert.equal(f.calls(), 0); assert.equal(f.controller.getState().status, 'unsupported');
});
test('simultaneous checks share one request and errors can be retried', async () => {
  const f = fixture(); await Promise.all([f.controller.check(), f.controller.check()]); assert.equal(f.calls(), 1);
  f.updater.emit('error', new Error('test network failure')); await f.controller.check(); assert.equal(f.calls(), 2);
});
test('download state survives reads and cannot be replaced by another check', async () => {
  const f = fixture(); f.updater.emit('update-available', { version: '1.0.18' });
  f.updater.emit('download-progress', { percent: 43.6 }); await f.controller.check();
  assert.equal(f.calls(), 0); assert.equal(f.controller.getState().percent, 43.6);
  assert.equal(f.controller.getState().version, '1.0.18');
});
test('restart requires downloaded update, can be cancelled and installs only once', async () => {
  const f = fixture(); f.controller.scheduleInstall(); assert.equal(f.controller.getState().status, 'idle');
  f.updater.emit('update-downloaded', { version: '1.0.18' }); f.controller.scheduleInstall(); f.tick();
  assert.equal(f.controller.getState().countdownSeconds, 14);
  f.controller.cancelInstall(); f.tick(); assert.equal(f.installs(), 0);
  f.controller.scheduleInstall(); f.controller.scheduleInstall();
  for (let i = 0; i < 16; i++) f.tick();
  await Promise.resolve(); assert.equal(f.installs(), 1); assert.equal(f.controller.getState().status, 'installing');
});
test('a rejected network check resolves to a retryable error', async () => {
  const f = fixture();
  f.updater.checkForUpdates = async () => { throw new Error('offline'); };
  assert.equal((await f.controller.check()).status, 'error');
  f.updater.checkForUpdates = async () => f.updater.emit('update-not-available');
  assert.equal((await f.controller.check()).status, 'none');
});
test('updater errors stop a pending countdown', async () => {
  const f = fixture(); f.updater.emit('update-downloaded', { version: '1.0.18' });
  f.controller.scheduleInstall(); f.updater.emit('error', new Error('installer missing'));
  for (let i = 0; i < 16; i++) f.tick();
  await Promise.resolve(); assert.equal(f.installs(), 0); assert.equal(f.controller.getState().status, 'error');
});
