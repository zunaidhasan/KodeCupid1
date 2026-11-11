# KodeCupid

KodeCupid is a static progressive web app prototype for verified professionals in healthcare, education, college and university, and science/public-health communities. Its demo flow focuses on shift-aware introductions, workplace privacy, and respectful member safety.

## Run locally

From the project root:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). The service worker is available on localhost and HTTPS; local files should be served over HTTP.

## Demo walkthrough

1. Select **Create your profile**, complete signup, and work through the eight onboarding steps. The phone code is simulated; use any six digits.
2. Discover suggestions, use filters, open a profile, and like or pass. Like/pass decisions remain saved after refresh.
3. Use a high-fit like to see the match dialog, then open the match's conversation and send a message or mock photo.
4. Visit **Settings** to update the profile, privacy, quiet hours, plan, blocked members, and report history.
5. Report or block a profile. Reports appear in the staff queue; blocked profiles leave discovery and matches.
6. Open **Staff demo** in the public header to review operations queues and demo actions.

## Features

- Hash-based navigation with browser back/forward support
- Age-gated onboarding, saved step progress, mock OTP, verification status, and profile preview
- Professional profiles with schedule compatibility, relationship goals, and visibility-aware fields
- Discovery filters, persistent likes/passes, refresh batches, and a one-match-per-week Free-plan limit
- Matches, pre-match intro credits, message threads, read indicators, mock image sharing, and expiry states
- Report/block confirmation, member safety history, and local admin moderation queues
- Settings for profile, privacy, workplace radius, quiet hours, video-chat preference, and subscription plan
- Responsive member and staff layouts, keyboard focus styles, and reduced-motion support
- PWA manifest, offline app-shell caching, and localStorage persistence

## Mock data and local storage

Profiles in `data/profiles.js` are fictional demo records. `services/mockApi.js` seeds demo matches, notifications, conversations, and a sample moderation report when corresponding local storage keys are absent. User actions are stored in the browser's localStorage, so they persist between reloads in the same browser profile. Use browser storage controls to reset the demo.

## Mocked integrations and limitations

This prototype does not connect to a backend. OTP, credential/NPI checks, file uploads, subscriptions, refunds, payments, member notifications, and staff authentication are local simulations. Selected photos and documents are not uploaded or persisted. Distance and compatibility values are illustrative; no live geolocation or recommendation service runs. Video calls and push notifications are not implemented. Staff demo access is not a security boundary.

## Next production steps

- Add a secure backend, real account authentication, authorization, and session management.
- Design privacy, retention, consent, deletion, and professional-verification policies with appropriate legal and domain review.
- Replace mock identity verification, messaging, reporting/moderation, payment, and notification services with audited integrations.
- Add automated unit, accessibility, browser, and service-worker tests before launch.

See [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md) for completed, mocked, and deferred work, and [QA_CHECKLIST.md](./QA_CHECKLIST.md) for the current manual QA record.
