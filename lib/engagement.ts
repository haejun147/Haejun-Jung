export type EngagementEvent = 'site_click' | 'section_time' | 'page_time';
export type EngagementProperties = {
  page_path: string;
  target?: string;
  section?: string;
  active_seconds?: number;
};
export type EngagementCapture = (
  event: EngagementEvent,
  properties: EngagementProperties,
  options?: { transport?: 'sendBeacon' },
) => void;

/** Anonymous, explicitly marked interactions; section times can overlap. */
export function attachEngagementTracking({ pathname, capture }: {
  pathname: string;
  capture: EngagementCapture;
}): () => void {
  const page_path = pathname.split(/[?#]/)[0];
  const intervalMs = 15_000;
  const sections = new Map<Element, { label: string; visible: boolean; ms: number }>();
  let focused = document.hasFocus();
  let away = false;
  let disposed = false;
  let active = focused && document.visibilityState === 'visible';
  let last = performance.now();
  let pageMs = 0;

  function checkpoint() {
    const now = performance.now();
    // A suspended tab/device must not contribute a long timer gap.
    const elapsed = Math.max(0, Math.min(now - last, intervalMs));
    last = now;
    if (!active) return;
    pageMs += elapsed;
    for (const section of sections.values()) {
      if (section.visible) section.ms += elapsed;
    }
  }

  function flush(options?: { transport?: 'sendBeacon' }) {
    checkpoint();
    if (pageMs > 0) {
      const ms = pageMs;
      pageMs = 0;
      capture('page_time', { page_path, active_seconds: ms / 1000 }, options);
    }
    for (const section of sections.values()) {
      if (section.ms <= 0) continue;
      const ms = section.ms;
      section.ms = 0;
      capture('section_time', { page_path, section: section.label, active_seconds: ms / 1000 }, options);
    }
  }

  const observer = new IntersectionObserver(entries => {
    if (disposed) return;
    checkpoint();
    for (const entry of entries) {
      const section = sections.get(entry.target);
      if (section) section.visible = entry.isIntersecting && entry.intersectionRatio > 0;
    }
  }, { threshold: [0, 0.01] });

  function syncSections() {
    if (disposed) return;
    const nodes = new Set(document.querySelectorAll('[data-analytics-section]'));
    const changed = nodes.size !== sections.size || [...nodes].some(node =>
      node.getAttribute('data-analytics-section') !== sections.get(node)?.label);
    if (!changed) return;
    // Flush the old labels/removed nodes before changing the tracked set.
    flush();
    for (const [node, section] of sections) {
      if (!nodes.has(node) || node.getAttribute('data-analytics-section') !== section.label) {
        observer.unobserve(node);
        sections.delete(node);
      }
    }
    for (const node of nodes) {
      const label = node.getAttribute('data-analytics-section');
      if (label && !sections.has(node)) {
        sections.set(node, { label, visible: false, ms: 0 });
        observer.observe(node);
      }
    }
  }
  syncSections();
  const mutations = new MutationObserver(syncSections);
  mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-analytics-section'] });

  function updateActivity() {
    flush({ transport: 'sendBeacon' });
    active = !away && focused && document.visibilityState === 'visible';
  }
  const onFocus = () => { focused = true; updateActivity(); };
  // A focused descendant iframe can blur window while the document stays focused.
  const onBlur = () => { focused = document.hasFocus(); updateActivity(); };
  const onVisibility = () => { focused = document.hasFocus(); updateActivity(); };
  const onPageHide = () => { away = true; updateActivity(); };
  const onPageShow = () => { away = false; focused = document.hasFocus(); updateActivity(); };
  function onClick(event: MouseEvent) {
    if (!active || !(event.target instanceof Element)) return;
    const target = event.target.closest('[data-analytics-click]')?.getAttribute('data-analytics-click');
    if (target) capture('site_click', { page_path, target });
  }
  document.addEventListener('click', onClick, true);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  const timer = window.setInterval(flush, intervalMs);

  return () => {
    if (disposed) return;
    disposed = true;
    flush({ transport: 'sendBeacon' });
    active = false;
    window.clearInterval(timer);
    observer.disconnect();
    mutations.disconnect();
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('focus', onFocus);
    window.removeEventListener('blur', onBlur);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  };
}
