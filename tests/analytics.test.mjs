import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/analytics.ts', import.meta.url), 'utf8');
let counter = 0;
async function setup() {
  const storage = new Map();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { doNotTrack: '0' } });
  const calls = [];
  let loads = 0;
  let config;
  const sdk = {
    init: (key, options) => { calls.push(['init', key]); config = options; },
    opt_in_capturing: options => calls.push(['in', options]),
    opt_out_capturing: () => calls.push(['out']),
    capture: (event, properties, options) => {
      const filtered = config.before_send({ event, properties });
      if (filtered) calls.push(['capture', filtered, options]);
    },
  };
  globalThis.__loadAnalyticsSdk = async () => { loads++; return { default: sdk }; };
  const js = ts.transpileModule(source.replace("import('posthog-js')", 'globalThis.__loadAnalyticsSdk()'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js + '\n//' + counter++).toString('base64')}`);
  return { mod, storage, calls, sdk, get loads() { return loads; }, get config() { return config; } };
}
const connection = { key: 'phc_test', host: 'https://us.i.posthog.com' };

test('import/config/consent reads remain dormant with no SDK load or identifiers', async () => {
  const ctx = await setup();
  assert.equal(ctx.mod.analyticsConfig({}), null);
  assert.equal(ctx.mod.analyticsConfig({ VITE_POSTHOG_KEY: 'phx_personal' }), null);
  assert.equal(ctx.mod.analyticsConfig({ VITE_POSTHOG_KEY: 'phc_test', VITE_POSTHOG_HOST: 'https://other.test' }), null);
  assert.deepEqual(ctx.mod.analyticsConfig({ VITE_POSTHOG_KEY: 'phc_test' }), connection);
  assert.equal(ctx.mod.readConsent(), null);
  ctx.mod.captureAnalytics('$pageview', { page_path: '/' });
  assert.equal(ctx.loads, 0);
  assert.equal(ctx.storage.size, 0);
  assert.equal(ctx.calls.length, 0);
});

test('DNT and GPC prevent SDK load', async () => {
  const ctx = await setup();
  navigator.doNotTrack = '1';
  assert.equal(await ctx.mod.enableAnalytics(connection), false);
  navigator.doNotTrack = '0'; navigator.globalPrivacyControl = true;
  assert.equal(await ctx.mod.enableAnalytics(connection), false);
  assert.equal(ctx.loads, 0);
});

test('revocation during SDK loading never initializes or captures', async () => {
  const ctx = await setup();
  let finish;
  globalThis.__loadAnalyticsSdk = () => new Promise(resolve => { finish = resolve; });
  const loading = ctx.mod.enableAnalytics(connection);
  ctx.mod.disableAnalytics();
  finish({ default: ctx.sdk });
  assert.equal(await loading, false);
  assert.deepEqual(ctx.calls, []);
});

test('manual tracking sends a single visit then route events with strict privacy options', async () => {
  const ctx = await setup();
  ctx.mod.storeConsent('allowed');
  await ctx.mod.enableAnalytics(connection);
  ctx.mod.captureAnalytics('$pageview', { page_path: '/?email=secret#private' });
  ctx.mod.captureAnalytics('$pageview', { page_path: '/cv' });
  const captures = ctx.calls.filter(call => call[0] === 'capture');
  assert.deepEqual(captures.map(call => call[1].event), ['site_visit', '$pageview', '$pageview']);
  assert.equal(captures[0][1].properties.is_returning, false);
  assert.equal(captures[1][1].properties.page_path, '/');
  assert.deepEqual(captures[0][2], { transport: 'sendBeacon', send_instantly: true });
  for (const field of ['autocapture', 'capture_pageview', 'capture_pageleave', 'capture_dead_clicks', 'capture_exceptions', 'capture_heatmaps', 'capture_performance', 'rageclick', 'ip']) assert.equal(ctx.config[field], false, field);
  assert.equal(ctx.config.disable_session_recording, true);
  assert.equal(ctx.config.disable_surveys, true);
  assert.equal(ctx.config.person_profiles, 'never');
  assert.equal(ctx.config.respect_dnt, true);
  ctx.mod.disableAnalytics();
  ctx.mod.captureAnalytics('site_click', { target: 'cv_download' });
  assert.equal(ctx.calls.filter(call => call[0] === 'capture').length, 3);
  assert.equal(ctx.storage.has('hj_analytics_session'), false);
});

test('payload allowlist drops SDK initial URL, referrer, query and text properties', async () => {
  const { mod } = await setup();
  assert.deepEqual(mod.sanitizeProperties({ page_path: '/cv?name=secret#private', '$current_url': 'https://x/?email=private', '$referrer': 'private', '$initial_referrer': 'private', '$initial_current_url': 'private', '$set': { email: 'private' }, text: 'private', target: 'cv_download', active_seconds: 2 }), { page_path: '/cv', target: 'cv_download', active_seconds: 2 });
});

test('before_send preserves ingestion token and removes top-level initial person properties', async () => {
  const ctx = await setup();
  await ctx.mod.enableAnalytics(connection);
  const result = ctx.config.before_send({ event: '$pageview', properties: { token: 'phc_test', page_path: '/' }, $set: { email: 'secret' }, $set_once: { $initial_current_url: '/?private=true' } });
  assert.equal(result.properties.token, 'phc_test');
  assert.equal('$set' in result, false);
  assert.equal('$set_once' in result, false);
  assert.equal(ctx.config.before_send({ event: '$autocapture', properties: {} }), null);
});

test('unknown routes containing private path segments are never captured', async () => {
  const ctx = await setup();
  ctx.mod.storeConsent('allowed');
  await ctx.mod.enableAnalytics(connection);
  ctx.mod.captureAnalytics('$pageview', { page_path: '/reset/private-token' });
  ctx.mod.captureAnalytics('page_time', { page_path: '/admin/secret', active_seconds: 3 });
  assert.equal(ctx.calls.filter(call => call[0] === 'capture').length, 0);
  assert.equal(ctx.mod.sanitizeProperties({ page_path: '/private/token' }).page_path, undefined);
});

test('visit persists across module instances and expires after 30 minutes', async () => {
  const { mod, storage } = await setup();
  const first = mod.getVisit(100);
  const second = mod.getVisit(500);
  assert.equal(first.fresh, true);
  assert.equal(second.fresh, false);
  assert.equal(first.id, second.id);
  const third = mod.getVisit(500 + 30 * 60 * 1000);
  assert.equal(third.fresh, true);
  assert.equal(third.isReturning, true);
  assert.notEqual(first.id, third.id);
  storage.set('hj_analytics_session', JSON.stringify({ id: 'other-tab', last: 2000000 }));
  assert.equal(mod.getVisit(2000010).id, 'other-tab');
});

test('storage denial fails safely and falls back to one in-memory visit', async () => {
  const { mod } = await setup();
  localStorage.getItem = localStorage.setItem = localStorage.removeItem = () => { throw Error('blocked'); };
  assert.equal(mod.readConsent(), null);
  mod.storeConsent('allowed');
  assert.equal(mod.getVisit(100).fresh, true);
  assert.equal(mod.getVisit(200).fresh, false);
  mod.disableAnalytics();
});

test('decline in another tab blocks captures immediately, before its storage handler', async () => {
  const ctx = await setup();
  ctx.mod.storeConsent('allowed');
  await ctx.mod.enableAnalytics(connection);
  ctx.mod.storeConsent('declined');
  ctx.mod.captureAnalytics('$pageview', { page_path: '/' });
  assert.equal(ctx.calls.filter(call => call[0] === 'capture').length, 0);
});
