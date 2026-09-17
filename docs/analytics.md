# Private website analytics

Analytics is **not connected yet**. With no `VITE_POSTHOG_KEY`, the site loads no analytics SDK, sends no analytics requests, and shows no consent banner. Existing historical visits cannot be recovered.

## Connect and keep reports private

1. Create a PostHog Cloud account and a **separate organization with only your account as a member**. Enable two-factor authentication. On the free plan, organization members can access projects; a private-looking project name is not an access restriction.
2. Create the website project. Put its **public project token** (`phc_…`) in Vercel's `VITE_POSTHOG_KEY` environment variable. Set `VITE_POSTHOG_HOST` to `https://us.i.posthog.com` or `https://eu.i.posthog.com` for the chosen region. Redeploy; Vite reads these at build time. Do not paste a personal API key or account password into frontend code, chat, or a `VITE_` variable.
3. Sign in at [PostHog](https://app.posthog.com/) (or [EU PostHog](https://eu.posthog.com/)) to view Activity and Product analytics. Website visitors receive only the public ingestion token, which permits sending events and does not grant access to reports. No report-reading API or admin dashboard is added to the website.
4. Create a dashboard for this project and **do not enable public sharing, embeds, or shared links**. Do not invite other organization members unless they should also have access. PostHog, as the service provider, processes the analytics; “private” means not publicly accessible to website visitors.
5. On your own browsers, use the website footer's **Analytics preferences → Decline analytics** to exclude your visits. This choice is per browser. Clearing browser data clears the preference. Other people may decline too, so counts are not all visitors.

## Reports to create

| Question | Event and aggregation |
| --- | --- |
| When did people visit? | `site_visit` in Activity, showing timestamp, `page_path`, `visit_id`, and `is_returning` |
| Daily visits / anonymous browsers | Daily total `site_visit` / unique users on `site_visit` |
| Pages opened | `$pageview` grouped by `page_path` |
| What was clicked? | Count `site_click`, grouped by `target` and `page_path` |
| CV download button clicks | `site_click` filtered to `target = cv_download`; this is not proof a download completed |
| Time on a page | Sum `page_time.active_seconds`, grouped by `page_path`; per-visit time groups additionally by `visit_id` |
| Time on a section | Sum `section_time.active_seconds`, grouped by `section`; group additionally by `visit_id` for a visit timeline |
| Returning visits | `site_visit` filtered to `is_returning = true`; divide by all `site_visit` for a return-visit rate |

For average time per visit, first sum each visit's time increments, then average those visit totals. Averaging raw events would average 15-second batches, not visit lengths. Dashboard dates use the selected project timezone; set it explicitly before interpreting “when”.

## Meaning and limits

- Only consenting browsers are measured. A small opt-in banner explains the data and its purpose. The footer reopens preferences. Do Not Track and Global Privacy Control disable analytics even if consent was previously granted. Decline stops tracking and clears the analytics session/SDK persistence. Browser storage failures do not break the site; return-visit recognition may be unavailable.
- Anonymous browser identifiers recognize return visits on the **same browser**, not a person's real identity. There is no name, email, organization identification, fingerprinting, login linkage, session recording, keyboard capture, automatic DOM-text capture, or collection of query/hash/referrer URLs. Clearing storage or changing browsers/devices creates a new anonymous visitor. IP-based geolocation enrichment is disabled; the analytics service still receives network requests.
- A visit expires after 30 minutes without a tracked event. Foreground page-time updates count as activity. Tabs share the latest visit record; simultaneous first events in multiple tabs can race and slightly overcount visits. Foreground time is **not proof of reading or attention** and has no mouse-idle cutoff.
- Section time measures when any of the marked section is in the viewport while the page is visible and focused. About profile/bio, each book's cover/details, and the CV viewer are marked. Simultaneously visible sections overlap, so section times must not be summed into page time.
- Time is emitted as increments approximately every 15 seconds and on route/visibility/focus changes or page exit. Browsers can drop the final event; ad blockers and interrupted connections can undercount. Frozen timer gaps are capped. Explicit clicks are collected only for marked navigation, theme/menu, contact, book links, and CV controls; link destinations and raw text are not sent.
- The PDF is embedded in the browser's PDF viewer. Internal PDF scrolling, pages read, toolbar clicks, and direct PDF URL opens are **not tracked** by this website code. Time measures the visible viewer as a whole, not individual PDF pages or proof of reading.
- Never infer a particular person visited from these records. Visitors with the public ingestion token can fabricate events, so this is approximate product analytics, not an audit log.

## Verify after connecting

In a fresh browser, confirm no PostHog request or identifier appears before opt-in. Allow analytics, navigate About → Book → CV, click a marked control, and keep a section visible for 15 seconds. Confirm events arrive in the private project and contain no query strings, contact addresses, or DOM text. Decline and confirm new events stop. Repeat with DNT/GPC enabled. A visit after 30 minutes should create another `site_visit` with `is_returning: true` on the same consenting browser.

References: [configuration](https://posthog.com/docs/libraries/js/config), [capture and consent](https://posthog.com/docs/libraries/js/usage), [persistence](https://posthog.com/docs/libraries/js/persistence).
