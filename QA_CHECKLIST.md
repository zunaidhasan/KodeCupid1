# Demo QA checklist

## Verified

- [x] `node --check` passed for `app.js`, `sw.js`, and all JavaScript files in `data/`, `lib/`, and `services/`
- [x] Searched app/data/styles/docs for developer-only labels and found none
- [x] Consolidated the active stylesheet to `styles.css`; updated the PWA shell cache list
- [x] Static route/state review: query routes, member gating, separate staff-demo gate, onboarding draft, persistent actions
- [x] Completed signup and all eight onboarding steps; a profile under 18 was blocked and the valid demo OTP proceeded
- [x] Completed mock verification and reached discovery
- [x] High-fit like displayed the match dialog and opened a match conversation
- [x] Sent a pre-match introduction and confirmed it persisted in the conversation
- [x] Sent a matched conversation message and confirmed it remained after reload
- [x] Submitted a report, found it in the staff queue, and resolved it
- [x] Blocked and unblocked a profile; confirmed the settings list updated
- [x] Changed a quiet-hours setting, confirmed persistence after reload, and restored the original value
- [x] Entered the staff demo and confirmed the operations overview loaded
- [x] Confirmed the active service worker served the app shell while offline
- [x] Confirmed Settings had no horizontal overflow at 360, 390, 768, 1024, and 1440 CSS pixels

## Still to verify before stakeholder demos

- [ ] Confirm invalid OTP rejection and pass/filter persistence
- [ ] Test plan changes, deletion-request submission, and remaining staff queue actions
- [ ] Visually inspect member and staff layouts at 360, 390, 768, 1024, and 1440 CSS pixels
- [ ] Keyboard-test dialogs, navigation, and form controls; check screen-reader announcements
- [ ] Install the PWA and verify its installed experience
- [ ] Check browser console/service-worker errors and verify offline fallback for uncached assets

## Still mocked / not production-tested

- OTP, NPI/credential verification, identity, all payments, uploads, messaging delivery, image transfer, notifications, video, geolocation, recommendations, admin authorization, and deletion processing
- No automated browser test suite or formal WCAG conformance audit is configured
