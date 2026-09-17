import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsConfig, captureAnalytics, CONSENT_KEY, disableAnalytics, enableAnalytics, PUBLIC_PATHS, privacySignal, readConsent, storeConsent } from '../lib/analytics';
import { attachEngagementTracking } from '../lib/engagement';

export const ANALYTICS_PREFERENCES_EVENT = 'hj:analytics-preferences';
export const configuredAnalytics = analyticsConfig(import.meta.env);

const SiteAnalytics: React.FC = () => {
  const { pathname } = useLocation();
  const [consent, setConsent] = useState(readConsent);
  const [open, setOpen] = useState(() => !!configuredAnalytics && !readConsent() && !privacySignal());
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(privacySignal);

  useEffect(() => {
    const show = () => { setBlocked(privacySignal()); setOpen(true); };
    const sync = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) {
        disableAnalytics();
        setReady(false);
        setConsent(readConsent());
      }
    };
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, show);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, show);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    if (configuredAnalytics && consent === 'allowed' && !blocked) {
      enableAnalytics(configuredAnalytics).then(ok => { if (!cancelled) setReady(ok); }).catch(() => { /* Analytics must never interrupt the website. */ });
    } else disableAnalytics();
    return () => { cancelled = true; disableAnalytics(); };
  }, [consent, blocked]);

  useEffect(() => {
    if (!ready || !PUBLIC_PATHS.has(pathname)) return;
    captureAnalytics('$pageview', { page_path: pathname });
    return attachEngagementTracking({ pathname, capture: captureAnalytics });
  }, [ready, pathname]);

  if (!configuredAnalytics || !open) return null;
  const choose = (value: 'allowed' | 'declined') => {
    if (value === 'declined') { disableAnalytics(); setReady(false); }
    storeConsent(value);
    setConsent(value);
    setOpen(false);
  };
  return (
    <aside aria-label="Analytics preferences" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-[420px] z-[60] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-lg text-sm text-gray-700 dark:text-gray-200">
      <p className="font-semibold mb-2">Optional visitor analytics</p>
      <p>Allow anonymous page visits, selected clicks, visible section time and return visits to be measured using PostHog? A browser identifier is saved to recognize return visits. Reports are private to the site owner. No session recordings or form contents are collected.</p>
      {blocked && <p className="mt-2">Your browser’s privacy preference is enabled, so analytics is off.</p>}
      <div className="flex gap-3 mt-4">
        {!blocked && <button onClick={() => choose('allowed')} className="rounded-lg bg-teal-700 text-white px-4 py-2">Allow analytics</button>}
        <button onClick={() => choose('declined')} className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2">{blocked ? 'Close' : 'Decline analytics'}</button>
      </div>
      <p className="mt-3 text-xs">Change this anytime using “Analytics preferences” in the footer.</p>
    </aside>
  );
};

export default SiteAnalytics;
