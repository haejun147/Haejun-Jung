import type { PostHog } from 'posthog-js';

export const CONSENT_KEY = 'hj_analytics_consent';
export const PUBLIC_PATHS = new Set(['/', '/book', '/cv']);
const SESSION_KEY = 'hj_analytics_session';
const SESSION_TIMEOUT = 30 * 60 * 1000;
export type Consent = 'allowed' | 'declined' | null;

export function analyticsConfig(env: { VITE_POSTHOG_KEY?: string; VITE_POSTHOG_HOST?: string }) {
  const key = env.VITE_POSTHOG_KEY?.trim();
  const host = env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
  return key?.startsWith('phc_') && ['https://us.i.posthog.com', 'https://eu.i.posthog.com'].includes(host)
    ? { key, host } : null;
}

export function privacySignal(nav: Pick<Navigator, 'doNotTrack'> & { globalPrivacyControl?: boolean } = navigator) {
  return nav.doNotTrack === '1' || nav.doNotTrack === 'yes' || nav.globalPrivacyControl === true;
}

export function readConsent(): Consent {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'allowed' || value === 'declined' ? value : null;
  } catch { return null; }
}

export function storeConsent(value: Exclude<Consent, null>) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Consent still works for this page. */ }
}

// Only these explicitly generated fields leave the browser. In particular, drop
// SDK referrers, initial URLs, query strings, DOM text and arbitrary superproperties.
const SAFE_PROPERTIES = new Set([
  'token', 'distinct_id', '$device_id', '$session_id', '$window_id', '$lib', '$lib_version',
  '$browser', '$browser_version', '$os', '$os_version', '$device_type',
  '$screen_height', '$screen_width', '$viewport_height', '$viewport_width',
  '$is_identified', '$process_person_profile', '$geoip_disable',
  'page_path', 'target', 'section', 'active_seconds', 'visit_id', 'is_returning',
]);

export function sanitizeProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([key]) => SAFE_PROPERTIES.has(key)).map(([key, value]) =>
    [key, key === 'page_path' ? (typeof value === 'string' && PUBLIC_PATHS.has(value.split(/[?#]/)[0]) ? value.split(/[?#]/)[0] : undefined) : value]));
}

type Visit = { id: string; last: number };
let memoryVisit: Visit | null = null;
export function getVisit(now = Date.now()) {
  let previous = memoryVisit;
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (stored && typeof stored.id === 'string' && Number.isFinite(stored.last)) previous = stored;
  } catch { /* Browsers may block storage. */ }
  const fresh = !previous || now - previous.last >= SESSION_TIMEOUT || now < previous.last;
  const visit = { id: fresh ? crypto.randomUUID() : previous.id, last: now };
  memoryVisit = visit;
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(visit)); } catch { /* Use memory only. */ }
  return { ...visit, fresh, isReturning: !!previous };
}

let client: PostHog | null = null;
let generation = 0;
let enabled = false;

export async function enableAnalytics(config: { key: string; host: string }) {
  const attempt = ++generation;
  if (privacySignal()) return false;
  const { default: posthog } = await import('posthog-js');
  if (attempt !== generation || privacySignal()) return false;
  if (!client) {
    posthog.init(config.key, {
      api_host: config.host,
      persistence: 'localStorage',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_performance: false,
      rageclick: false,
      disable_session_recording: true,
      disable_surveys: true,
      mask_all_text: true,
      mask_all_element_attributes: true,
      person_profiles: 'never',
      respect_dnt: true,
      advanced_disable_feature_flags: true,
      advanced_disable_flags: true,
      disable_external_dependency_loading: true,
      save_campaign_params: false,
      save_referrer: false,
      ip: false,
      before_send: event => {
        if (!enabled || privacySignal() || !['site_visit', '$pageview', 'site_click', 'section_time', 'page_time'].includes(event.event)) return null;
        event.properties = sanitizeProperties(event.properties);
        delete event.$set;
        delete event.$set_once;
        return event;
      },
    });
    client = posthog;
  }
  enabled = true;
  client.opt_in_capturing({ captureEventName: false });
  return true;
}

export function disableAnalytics() {
  generation++;
  enabled = false;
  client?.opt_out_capturing();
  memoryVisit = null;
  try { localStorage.removeItem(SESSION_KEY); } catch { /* Storage is optional. */ }
}

export function captureAnalytics(event: string, properties: Record<string, unknown>) {
  if (!enabled || !client || privacySignal() || readConsent() === 'declined') return;
  const path = typeof properties.page_path === 'string' ? properties.page_path.split(/[?#]/)[0] : '';
  if (!PUBLIC_PATHS.has(path)) return;
  const visit = getVisit();
  const common = { visit_id: visit.id, $geoip_disable: true };
  const options = { transport: 'sendBeacon' as const, send_instantly: true };
  if (visit.fresh) client.capture('site_visit', { ...common, page_path: properties.page_path, is_returning: visit.isReturning }, options);
  client.capture(event, { ...properties, ...common }, options);
}
