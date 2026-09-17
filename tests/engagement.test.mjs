import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/engagement.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { attachEngagementTracking } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

function setup() {
  let now = 0;
  let focused = true;
  let interval;
  let intersection;
  let mutation;
  let disconnected = 0;
  let nodes = [];
  const events = [];
  const options = [];
  const target = () => {
    const listeners = new Map();
    return {
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      emit(name, event = {}) { for (const fn of listeners.get(name) || []) fn(event); },
      count() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
    };
  };
  class Element {
    constructor(attrs = {}, parent = null) { this.attrs = attrs; this.parent = parent; }
    getAttribute(name) { return this.attrs[name] ?? null; }
    closest(selector) { const attr = selector.slice(1, -1); return this.attrs[attr] ? this : this.parent?.closest(selector); }
  }
  const document = { ...target(), visibilityState: 'visible', hasFocus: () => focused, querySelectorAll: () => nodes, body: {} };
  const window = { ...target(), setInterval(fn) { interval = fn; return 1; }, clearInterval() { interval = undefined; } };
  const originals = new Map();
  const globals = {
    document, window, Element, performance: { now: () => now },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} unobserve() {} disconnect() { disconnected++; } },
    MutationObserver: class { constructor(fn) { mutation = fn; } observe() {} disconnect() { disconnected++; } },
  };
  for (const [key, value] of Object.entries(globals)) { originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, { configurable: true, writable: true, value }); }
  return {
    document, window, Element, events, options,
    advance(ms) { now += ms; },
    tick() { interval?.(); },
    focus(value) { focused = value; window.emit(value ? 'focus' : 'blur'); },
    visibility(value) { document.visibilityState = value; document.emit('visibilitychange'); },
    section(label) { const node = new Element({ 'data-analytics-section': label }); nodes.push(node); mutation?.(); return node; },
    remove(node) { nodes = nodes.filter(n => n !== node); mutation(); },
    visible(node, value = true) { intersection([{ target: node, isIntersecting: value, intersectionRatio: value ? 0.01 : 0 }]); },
    attach() { return attachEngagementTracking({ pathname: '/cv?secret=ignored#fragment', capture: (name, props, opts) => { events.push({ name, ...props }); options.push(opts); } }); },
    total(name) { return events.filter(e => e.name === name).reduce((sum, e) => sum + (e.active_seconds || 0), 0); },
    disposed() { return !interval && disconnected === 2 && document.count() === 0 && window.count() === 0; },
    restore() { for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } },
  };
}

function check(name, fn) { test(name, () => { const env = setup(); try { fn(env); } finally { env.restore(); } }); }

check('intervals emit deltas; hidden, pagehide and cleanup never double count', e => {
  const section = e.section('research'); const stop = e.attach(); e.visible(section);
  e.advance(15000); e.tick(); e.advance(5000); e.visibility('hidden');
  e.window.emit('pagehide'); e.advance(100000); e.tick(); stop(); stop();
  assert.equal(e.total('page_time'), 20); assert.equal(e.total('section_time'), 20);
  assert.deepEqual(e.events.filter(x => x.name === 'page_time').map(x => x.active_seconds), [15, 5]);
  assert.ok(e.disposed());
  assert.deepEqual(e.options.slice(-2), [{ transport: 'sendBeacon' }, { transport: 'sendBeacon' }]);
});

check('blur and hidden time excluded; bfcache pageshow resumes', e => {
  const stop = e.attach(); e.advance(2000); e.focus(false); e.advance(100000); e.tick();
  e.focus(true); e.advance(3000); e.visibility('hidden'); e.advance(100000);
  e.visibility('visible'); e.advance(1000); e.window.emit('pagehide'); e.advance(100000);
  e.window.emit('pageshow'); e.advance(4000); stop();
  assert.equal(e.total('page_time'), 10);
});

check('nested svg click captures only marker and path, never text, href or query', e => {
  const stop = e.attach();
  const link = new e.Element({ 'data-analytics-click': 'cv_download', href: 'secret' });
  const svgPath = new e.Element({}, new e.Element({}, link));
  e.document.emit('click', { target: svgPath }); e.document.emit('click', { target: new e.Element() });
  assert.deepEqual(e.events, [{ name: 'site_click', page_path: '/cv', target: 'cv_download' }]);
  stop(); e.document.emit('click', { target: svgPath }); assert.equal(e.events.length, 1);
});

check('dynamically inserted and removed sections retain elapsed time only while visible', e => {
  const stop = e.attach(); const section = e.section('cv_preview'); e.visible(section);
  e.advance(2000); e.visible(section, false); e.advance(3000); e.visible(section);
  e.advance(4000); e.remove(section); e.advance(5000); stop();
  assert.equal(e.total('section_time'), 6); assert.equal(e.total('page_time'), 14);
});

check('long timer gaps are capped and background initial load is ignored', e => {
  e.visibility('hidden'); const stop = e.attach(); e.advance(100000); e.tick();
  assert.equal(e.total('page_time'), 0);
  e.visibility('visible'); e.advance(100000); e.tick(); stop(); assert.equal(e.total('page_time'), 15);
});

check('simultaneously visible sections count independently without inflating page time', e => {
  const first = e.section('about'); const second = e.section('research'); const stop = e.attach();
  e.visible(first); e.visible(second); e.advance(5000); stop();
  assert.equal(e.total('page_time'), 5); assert.equal(e.total('section_time'), 10);
  assert.deepEqual(e.events.filter(x => x.name === 'section_time').map(x => x.section), ['about', 'research']);
});

check('iframe window blur retains time when document is focused; true blur pauses', e => {
  const section = e.section('cv_preview'); const stop = e.attach(); e.visible(section);
  e.advance(2000); e.window.emit('blur');
  e.advance(3000); e.tick();
  assert.equal(e.total('page_time'), 5); assert.equal(e.total('section_time'), 5);
  e.focus(false); e.advance(10000); e.tick(); stop();
  assert.equal(e.total('page_time'), 5); assert.equal(e.total('section_time'), 5);
});
