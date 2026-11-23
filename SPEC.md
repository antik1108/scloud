# Lumio — Product & Technical Specification

> **Working name:** `Lumio` (placeholder; rename freely). An AI photo and video editor for portraits, built in **React Native (Expo)** — iOS ships first, Android from the same codebase — with a Firebase backend.
> **Reference app:** Lensa (iOS), captured on Motvin on 2026-10-27 — https://motvin.com/inspirations/app/lensa
> We copy *patterns and flows*, never Lensa's name, logo, copy, imagery or style artwork. All branding, style presets and sample images must be our own.

---

## 1. Product overview

Lumio lets people:

1. **Edit portraits on-device** — pick a photo from the library (face-first), retouch skin/eyes/teeth, adjust light and colour, blur or replace the background, apply filters, then export.
2. **Generate AI portraits ("Magic AI")** — pick a style (e.g. "Digicam → Compact", "Magic Hours → Golden Hour", "Trends"), upload one selfie, spend **Magic Tokens**, and get stylised results saved in **My creations**.
3. **Edit short videos** — mix photos and videos into one clip, apply filters/retouch, export.
4. **Pay** via a **Pro subscription** (unlimited saves, pro tools, monthly token grant, 7-day trial) and **token top-up packs** (consumable IAP).

### Business model (from the reference app)

| | Free | Pro |
|---|---|---|
| Save photos | 1 per day | Unlimited |
| Pro features (pro retouch tools, Max export resolution/quality, metadata removal) | — | Included |
| AI tokens | 0 | Weekly plan: 40 / week · Yearly plan: 300 / year · Trial: 25 |

- Plans: **Weekly**, **Monthly**, **Yearly** (yearly carries the **7-day free trial**, "Try 7 days and decide").
- Token packs (consumables): **150 / 400 / 900** tokens ("Best value" on 400).
- One AI style generation costs **15 tokens** (configurable per style).
- All amounts live in Remote Config / `config/pricing` so they can change without a release.

### Non-goals for v1
- **Android launch** — the codebase is cross-platform and Android must keep building in CI, but v1 ships on iOS only. Android launch (Google Play Billing + server verification) is v1.1. The login screen copy promises cross-device subscription via account linking.
- Mac / web apps.
- Social feed / sharing inside the app (share sheet only).
- Training a personalised model per user ("avatars" from 10–20 selfies) — candidate for v2.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| App | **React Native + Expo (SDK 58), TypeScript strict** | Expo **development builds** (not Expo Go — native Firebase modules need them), `expo-router` file-based navigation, EAS Build/Submit/Update |
| Firebase client | **React Native Firebase** (`@react-native-firebase/*`, modular API) | Native SDKs: Auth, Firestore, Storage, Functions, Remote Config, Analytics, Crashlytics, Messaging, App Check |
| State & data | **Zustand** (client/UI state), **TanStack Query** (server data, caching), Firestore listeners wrapped in hooks | |
| Local persistence | **expo-sqlite** (+ Drizzle ORM) for edit/video projects; **react-native-mmkv** for settings & flags | |
| Media access | `expo-media-library`, `expo-image-picker`, `react-native-vision-camera`, `expo-image` | |
| On-device imaging | **@shopify/react-native-skia** (GPU shaders, LUT filters, adjustments, compositing) + **ML Kit** face detection & selfie segmentation via an **Expo native module** (`modules/lumio-vision`) | Editing never needs the network |
| Video | **Expo native module** `modules/lumio-video` wrapping AVFoundation (iOS) / Media3 Transformer (Android) | Built in Phase 7 |
| UI primitives | `react-native-reanimated`, `react-native-gesture-handler`, `@gorhom/bottom-sheet`, `expo-haptics` | |
| Auth | **Firebase Auth** — Anonymous, Sign in with Apple (`expo-apple-authentication`), Google (`@react-native-google-signin/google-signin`), **Email one-time code** (custom token via Cloud Functions) | |
| Database | **Cloud Firestore** | Server-authoritative balances & entitlements |
| Files | **Cloud Storage for Firebase** | AI inputs/outputs only — edited photos stay on device |
| Server logic | **Cloud Functions for Firebase (2nd gen), TypeScript, Node 22** | Callables, Cloud Tasks queue, HTTPS webhooks, schedulers |
| Secrets | **Secret Manager** via `defineSecret` | AI provider key, App Store keys, email API key |
| Payments | **react-native-iap** (StoreKit 2 on iOS, Play Billing on Android) + **App Store Server API / Server Notifications V2** verified in Functions (Play Developer API + RTDN in v1.1) | Stores require IAP for digital goods |
| AI generation | External image model provider behind a `GenerationProvider` interface (evaluate fal.ai / Replicate / self-hosted; identity-preserving image-to-image) | Chosen in Phase 6 spike |
| Email (OTP) | Transactional email API (Resend / SendGrid / Postmark) from Functions | |
| Config & experiments | **Remote Config**, **A/B Testing** | Prices shown, token costs, paywall variant, feature flags |
| Abuse protection | **App Check** (App Attest on iOS, Play Integrity on Android) enforced on Functions, Firestore, Storage | |
| Observability | **Crashlytics**, **Analytics**, **Performance Monitoring**, Cloud Logging | |
| Push | **FCM** via APNs | "Your portraits are ready" |
| Testing | **Jest (jest-expo)** + **React Native Testing Library**; **Maestro** for E2E flows; Vitest for Functions | |
| Local dev | **Firebase Emulator Suite** (Auth, Firestore, Storage, Functions) | Required for tests |

Environments: two Firebase projects — `lumio-dev` and `lumio-prod` — selected by `APP_ENV` in `app.config.ts`, which picks the bundle ID and the `GoogleService-Info.plist` / `google-services.json` from `mobile/firebase-config/{dev,prod}/`. EAS build profiles `development`, `preview` (dev backend) and `production` (prod backend).

---

## 3. Information architecture

```
Launch
 ├─ Splash
 ├─ Welcome (first run) ── "Get Started" ── ATT prompt
 ├─ Log in (Apple / Google / Email / Skip → anonymous)
 │    └─ Email → Code → (success) ─┐
 └─ Paywall (first run, closable) ◄┘
Main (floating 4-item tab bar)
 ├─ Photos       — face-first library, Camera / All photos / Edited, → Editor
 ├─ Magic AI     — Female/Male toggle, style rows, "My creations", → Style detail → Generate
 ├─ Videos       — media picker sheet (photos + videos), → Video editor
 └─ Settings     — profile, plan, tokens, export settings, support, legal, sign out, delete
Global: Paywall sheet, Token top-up sheet, Permission prompts, Toasts
```

Visual language (observed): dark-first UI (near-black background, elevated grey cards with large corner radius), large left-aligned screen titles, floating capsule tab bar, **white pill primary CTAs**, a **lime accent** for Pro/Upgrade/Top-up, **yellow** for auth CTAs and "My creations", red for destructive actions. We keep the *structure* but define our own palette and typography in `DesignSystem` (Phase 0).

---

## 4. Screen inventory & flows

Every screen below was seen in the Motvin capture unless marked **(ours)** — those are not in the capture and we design them.

### 4.1 Onboarding — [flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-onboarding)
| # | Screen | Content / behaviour |
|---|---|---|
| O1 | Splash | Logo mark + wordmark on black. While shown: configure Firebase, restore auth, fetch Remote Config (≤1.5 s timeout). |
| O2 | Welcome | "Welcome to Lumio", social proof block (rating + user count — only real numbers, from Remote Config), **Get Started**, legal footer with Privacy Policy / Terms links. |
| O3 | Tracking permission | System ATT prompt fired after Get Started. App must work identically if denied. |

### 4.2 Authentication — [flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-logging-in-with-email)
| # | Screen | Content / behaviour |
|---|---|---|
| A1 | Log in options | Title "Log in", sub-copy "Link your subscription to your account…", **Continue with Apple / Google / Email**, "Opt-out from marketing emails" radio, **Skip** (top-right → anonymous session), legal footer. |
| A2 | Email entry | Back, "Enter your email to sign in or create an account", email field, **Continue** (loading spinner in button), marketing consent checkbox. |
| A3 | Code entry | "An email with the code has been sent to {email}", 6-digit numeric field (supports iOS one-time-code autofill), **Submit**, "Didn't get the code? Try again" (resend, 30 s cooldown). |
| A4 | Code error | Red border + "Invalid code, please enter one from email". After 5 bad attempts → code invalidated, must resend. |
| A5 | Post-login paywall | See P1. Shown once after first login if user is not Pro. |

Account linking: an anonymous user who signs in **links** the credential (keeps tokens, creations, purchases). If the credential already belongs to another account, sign in to that account and merge nothing silently — show "This account already exists; switch to it?".

### 4.3 Paywall & purchases — [subscribe flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-subscribing) · [top-up flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-placing-an-order)
| # | Screen | Content / behaviour |
|---|---|---|
| P1 | Paywall (trial variant) | **Restore** (top-left), close ✕ (top-right), "Lumio Pro / Unlock full access", Free-vs-Pro comparison table (Save Photos, Pro Features, AI Tokens), discount badge + struck-through price + yearly price, "*25 AI Tokens available during free trial", "Try 7 days and decide", **Start Trial**, legal footer. |
| P2 | Paywall (plan picker variant) | Same header/table; **Weekly / Monthly** segmented control; price line updates per plan; **Subscribe Now**. Variant chosen by Remote Config. |
| P3 | Quick Top-up sheet | Bottom sheet "Quick Top-up / Choose the amount of tokens", segmented **150 / 400 / 900**, price + "Best value" tag, **Continue**. |
| P4 | Store connecting | HUD "Connecting to the App Store…" while the store purchase request runs. |
| P5 | System purchase sheet | Apple's sheet (not ours). On success → server verification → balance/entitlement updates live via Firestore listener → toast. |

Prices are always read from the store product's localized display price (react-native-iap) — never hard-coded. The "original price" for the strike-through comes from Remote Config.

### 4.4 Photos tab — [photos](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-photos) · [permissions](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-granting-app-permissions)
| # | Screen | Content / behaviour |
|---|---|---|
| H1 | Photos empty state | Large "Photos" title, lime **Upgrade** pill (hidden for Pro), card "Add Photo for Editing / Allow access to Photos to start editing", **Choose Photo**; bottom shortcuts **Camera / All photos / Edited**; tab bar (Magic AI carries a "NEW" badge from Remote Config). |
| H2 | Photo library permission | System prompt (support Limited access). |
| H3 | Notifications permission | System prompt — **we ask later** (after first generation is queued), not here; better opt-in rate. |
| H4 | Photos home | Chips **Faces / Recents / Favourites / Selfies**; 3-column grid; skeleton loading state. "Faces" = library photos where on-device face detection finds ≥1 face (indexed in background, cached in SQLite). |
| H5 | Camera **(ours)** | Front-camera capture → straight into Editor. |
| H6 | Edited **(ours)** | Grid of locally saved edit projects (re-openable, non-destructive). |

### 4.5 Photo editor **(ours — not in capture)**
Core product surface; design it in Phase 4.
- Canvas with pinch-zoom, press-and-hold for before/after.
- Tool bar sections: **Retouch** (auto-enhance, skin smoothing, blemish removal, eye brighten, teeth whiten, face light), **Background** (blur with depth/segmentation, replace with colour/image), **Adjust** (exposure, contrast, saturation, warmth, tint, highlights, shadows, sharpen, grain, vignette), **Filters** (our own LUT packs), **Crop** (ratios, rotate, straighten).
- Pro tools show a crown and open the paywall when applied-and-saved by a free user (allow preview, gate export).
- Non-destructive: an edit is a list of operations stored in SQLite as JSON; re-render from original.
- **Save** → applies Export settings → writes to Photos library → counts against free daily save limit.

### 4.6 Magic AI tab — [flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-magic-ai) · [style preview](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-opening-a-page-photos)
| # | Screen | Content / behaviour |
|---|---|---|
| M1 | Magic AI home | Title, yellow **My creations ›** pill, **Female / Male** segmented control (filters styles), horizontal carousels per category (e.g. *Digicam*: Compact, Disposable, Instant; *Magic Hours*: Golden Hour, Blue Hour, Sunrise; *Trends*: …). Data from Firestore `styles` + `styleCategories`, cached offline. |
| M2 | Style detail | ✕ close, style name, "Your photo" slot (**Select photo**) ✨ style sample card, bottom panel **Generate • 15 ✦** (disabled until a photo is chosen), "Magic Tokens balance N ✦". Insufficient balance → Top-up sheet (or paywall for free users). |
| M3 | Generating **(ours)** | Progress state, can leave the screen; push notification + in-app badge when done. |
| M4 | Result **(ours)** | Swipeable results, Save (counts as a save), Share, Regenerate, Report a problem. |
| M5 | My creations | Grid of past generations (newest first) with status chips; empty state "No creations yet / All your generations will be saved here". |

### 4.7 Videos tab — [flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-videos)
| # | Screen | Content / behaviour |
|---|---|---|
| V1 | Media picker sheet | "Cancel / Select photos & videos", selected-items tray ("Mix photos and videos in one clip!"), album menu (**Recents ▾**), filter **All / Photos / Videos**, grid. |
| V2 | Video editor **(ours)** | Timeline with clips, trim/split/reorder, per-clip duration for photos, filters & adjust (same LUT/adjustment parameters applied natively per frame), face retouch (per-frame face detection, Pro), aspect ratio, music (bundled royalty-free tracks only), export (720p free / 1080p+4K Pro). |

### 4.8 Settings — [flow](https://motvin.com/inspirations/flows?flow=lensa-ios-versions-2026-10-27-settings)
| # | Screen | Content / behaviour |
|---|---|---|
| S1 | Settings | **Profile** (email + "Signed in with e-mail/Apple/Google", or "Sign in" for anonymous), **Subscription** ("Free Plan / Save 1 photo per day" + Upgrade, or Pro plan + renewal date + Manage), **Magic Tokens** (balance + **Top-up**), **Photo export settings ›**, **Support** (Send Feedback, Privacy & Legal ›), **Email tips & updates** toggle, Rate on the App Store, Restore Purchases, Clear Video Editor Cache, Free up space ›, **Sign Out**, **Delete Account & Data**, version footer. |
| S2 | Export settings | Segmented rows: **Format** JPEG/HEIC/PNG · **Resolution** FullHD/4K/Max👑 · **Quality** Compact/Balanced/Max👑 · **Metadata** Keep/Remove👑 · **Date** Original/Today, each with a one-line explanation. Stored locally + mirrored to `users/{uid}.exportSettings`. |
| S3 | Free up space | List of local projects with sizes, or "Nothing to clean-up yet"; toggle "Automatically delete projects unused over 1 month" (`expo-background-task`). |
| S4 | Sign out confirm | Alert "Signing out / Are you sure?" Cancel / Sign out. |
| S5 | Delete account confirm | Alert explaining subscription stays with Apple ID, all data incl. generated images deleted permanently. Calls `deleteAccount`. |
| S6 | Privacy & Legal | Privacy Policy, Terms of Use, Open Source Libraries ›, **Don't share my data** (opt-out of ad attribution sharing) + explanation. |
| S7 | Send feedback **(ours)** | Text + optional screenshot → `feedback` collection. |

---

## 5. Backend design (Firebase)

### 5.1 Firestore data model

```
users/{uid}
  email?: string
  providers: string[]                    // "anonymous" | "apple.com" | "google.com" | "email-code"
  createdAt, lastActiveAt: timestamp
  marketingOptIn: bool                   // client-writable
  settings: { emailTips: bool, autoCleanup: bool, dontShareData: bool }   // client-writable
  exportSettings: { format, resolution, quality, metadata, date }          // client-writable
  // ---- server-only fields below (rules forbid client writes) ----
  tokenBalance: int
  entitlement: { tier: "free"|"pro", productId?, expiresAt?, willRenew?, inTrial?, originalTransactionId? }
  fcmTokens: string[]                    // written via callable registerDevice

users/{uid}/ledger/{entryId}             // server-only, append-only
  delta: int, balanceAfter: int
  reason: "purchase"|"subscription_grant"|"trial_grant"|"generation"|"refund"|"admin"
  refId: string                          // transactionId / generationId
  createdAt

users/{uid}/generations/{genId}          // client read; server write
  styleId, styleVersion, cost
  inputPath: string                      // Storage path
  outputPaths: string[]
  status: "queued"|"processing"|"succeeded"|"failed"|"blocked"
  error?: { code, message }
  provider, providerJobId?
  createdAt, startedAt?, completedAt?

users/{uid}/purchases/{transactionId}    // server-only
  productId, originalTransactionId, type: "subscription"|"consumable"
  purchaseDate, expiresDate?, environment: "Sandbox"|"Production", revokedAt?

users/{uid}/usage/{yyyy-MM-dd}           // server-only
  saves: int

styles/{styleId}                         // public read, admin write
  name, categoryId, gender: "female"|"male"|"unisex"
  sampleImagePath, thumbPath, cost: int, order: int
  active: bool, isNew: bool, proOnly: bool, version: int

stylePrompts/{styleId}                   // server-only (no client read) — prompt, model, params, seed policy
styleCategories/{categoryId}             // public read: title, order, active
config/pricing                           // public read: token costs, grants, pack sizes
emailCodes/{sha256(email)}               // server-only: codeHash, expiresAt, attempts, lastSentAt
feedback/{id}                            // client create-only
appStoreTransactions/{originalTransactionId}  // server-only: uid mapping for server notifications
```

### 5.2 Storage layout
```
public/styles/{styleId}/sample.jpg|thumb.jpg      read: anyone signed in; write: none
users/{uid}/inputs/{genId}.jpg                    write: owner, image/jpeg|heic, ≤ 10 MB; read: owner
users/{uid}/outputs/{genId}/{n}.jpg               write: none (server); read: owner
feedback/{uid}/{id}.jpg                           write: owner ≤ 5 MB
```
Inputs are deleted 24 h after the generation finishes (scheduled function). Outputs kept until the user deletes the creation or the account.

### 5.3 Security rules — principles
- Default deny. Every path explicitly allowed.
- Users read/write only under their own `uid`.
- Client may update only `marketingOptIn`, `settings`, `exportSettings`, `lastActiveAt` on `users/{uid}` (enforced with `request.resource.data.diff(resource.data).affectedKeys().hasOnly([...])`).
- **No client writes** to balances, entitlements, ledger, purchases, usage, generations, emailCodes.
- Rules are covered by `@firebase/rules-unit-testing` tests in CI.

### 5.4 Cloud Functions (TypeScript)

| Function | Type | Purpose |
|---|---|---|
| `onUserCreated` | Auth blocking (`beforeUserCreated`) or Auth trigger | Create `users/{uid}` with balance 0, tier free |
| `requestEmailCode` | Callable | Rate-limit per email/IP, generate 6-digit code, store hash + 10 min expiry, send email |
| `verifyEmailCode` | Callable | Check hash, attempts ≤ 5, expiry; find/create Auth user by email; return **custom token** (client calls `signInWithCustomToken` or links) |
| `registerDevice` | Callable | Store FCM token |
| `verifyPurchase` | Callable | Input: StoreKit 2 signed transaction JWS (from react-native-iap; Android purchase token in v1.1). Verify signature chain with Apple root certs (App Store Server Library), check bundle ID/env, idempotently record purchase, grant tokens (consumable) or set entitlement + grant (subscription) |
| `appStoreNotifications` | HTTPS | App Store Server Notifications V2: renewals (grant tokens), expirations, refunds (revoke entitlement, claw back unspent tokens), billing retry |
| `createGeneration` | Callable | Validate style/active/gender, input exists & owned, App Check; **Firestore transaction**: balance ≥ cost → debit + ledger entry + create generation doc (`queued`); enqueue Cloud Task |
| `processGeneration` | Task queue (`onTaskDispatched`), retries w/ backoff | Moderate input → call `GenerationProvider` → moderate outputs → write to Storage → `succeeded`; on terminal failure → `failed` + **refund** in a transaction; send FCM |
| `recordSave` | Callable | Increments `usage/{date}.saves`; returns `{allowed}` (free: 1/day; Pro: unlimited). Client calls before writing to Photos |
| `deleteCreation` | Callable | Delete generation doc + outputs |
| `deleteAccount` | Callable | Recursive delete `users/{uid}`, Storage `users/{uid}/`, Auth user; keep anonymised purchase record for refunds/fraud |
| `cleanupInputs` | Scheduled (hourly) | Delete inputs older than 24 h after completion; mark stuck `processing` > 15 min as failed + refund |
| `submitFeedback` | Callable | Store feedback, optional Slack/email notify |

Shared server modules: `ledger.ts` (the **only** code allowed to change `tokenBalance`), `entitlements.ts`, `providers/` (`GenerationProvider` interface + implementations + a `FakeProvider` for emulator/tests), `moderation.ts`, `appstore.ts`.

### 5.5 Generation pipeline (sequence)
```
App                         Storage            Functions                   Provider
 │ pick photo → resize ≤2048, strip EXIF
 │ upload users/{uid}/inputs/{genId}.jpg ──► ✓
 │ createGeneration(styleId, genId) ─────────────────► txn: debit, ledger, doc=queued
 │                                                     enqueue task
 │ ◄── listen generations/{genId} (snapshot)           processGeneration:
 │                                                       status=processing
 │                                                       moderate input ──► (safety)
 │                                                       generate ────────────────► model
 │                                                       moderate outputs
 │                                                       write outputs ──► Storage
 │                                                       status=succeeded, FCM push
 │ show results (download URLs / Storage SDK)
 failure path: status=failed + refund ledger entry (same txn), FCM "Couldn't generate — tokens returned"
```
Idempotency: `genId` is client-generated UUID; `createGeneration` refuses duplicates; task handler no-ops if status is terminal.

### 5.6 Safety & privacy requirements
- Reject inputs with no detectable face, multiple faces (v1), or that fail the safety check (nudity, apparent minors). Status `blocked`, tokens refunded.
- Run a safety classifier on outputs; never deliver NSFW results.
- Face images are processed only to fulfil the request; inputs auto-deleted after 24 h; never used for training. State this in the privacy policy and App Store privacy labels.
- "Don't share my data" disables ad-attribution SDK data sharing.
- Delete Account removes all user data within the same request (Storage + Firestore + Auth).

---

## 6. App architecture (React Native)

```
mobile/
  app.config.ts         APP_ENV → bundle id, name, Firebase files, plugins
  eas.json              development / preview / production profiles
  firebase-config/      dev|prod GoogleService-Info.plist + google-services.json
  src/
    app/                expo-router routes (screens only — thin)
      _layout.tsx       providers (QueryClient, toast, services), Firebase bootstrap
      (onboarding)/     splash, welcome
      (auth)/           login, email, code
      (tabs)/           _layout.tsx (CapsuleTabBar), photos, magic-ai, videos, settings
      paywall.tsx, top-up.tsx, editor/[id].tsx, style/[id].tsx, creations.tsx, ...
    design-system/      tokens (colors, typography, spacing, radii) + components
                        (PillButton, CapsuleTabBar, SegmentedPill, Card, SectionHeader,
                         EmptyState, Toast, Skeleton)
    features/<name>/    components, hooks, view-model hooks, feature tests
    services/           interfaces + implementations: firebase/ (auth, firestore, storage,
                        functions, remote-config), purchases/, media/, analytics/
    lib/                env.ts, errors.ts, logger.ts, utils
    stores/             zustand stores (session, ui)
    db/                 expo-sqlite + drizzle schema (EditProject, VideoProject, CachedStyle)
  modules/
    lumio-vision/       Expo native module: face detection/landmarks, segmentation (Phase 3–4)
    lumio-video/        Expo native module: composition & export (Phase 7)
  __tests__/ + co-located *.test.ts(x)   Jest + RNTL
  e2e/                  Maestro flows run against the Firebase emulator
```
Rules: route files are thin and delegate to `src/features`; screen logic lives in custom hooks (`useXxxScreen`) that are unit-tested; services are TypeScript interfaces provided through a `ServicesProvider` context with fakes for tests; no `@react-native-firebase` imports outside `src/services/firebase`.

---

## 7. Analytics events (minimum)
`onboarding_started`, `onboarding_completed`, `att_result`, `login_started{method}`, `login_succeeded{method}`, `paywall_shown{source,variant}`, `purchase_started{product}`, `purchase_succeeded{product}`, `purchase_failed{reason}`, `topup_shown{source}`, `photo_opened{source}`, `tool_applied{tool,pro}`, `photo_saved{format,resolution}`, `save_limit_hit`, `style_opened{style}`, `generation_requested{style,cost}`, `generation_succeeded{style,duration_ms}`, `generation_failed{style,code}`, `video_exported{duration_s,resolution}`, `account_deleted`.

---

## 8. Build phases

Each phase ends with a **demoable EAS build on TestFlight (internal)** and green CI (Android must still build). Do not start a phase until the previous phase's exit criteria are met.

### Phase 0 — Foundations (≈1 week)
**Goal:** empty-but-real app and backend that deploy from CI.
- Expo app in `mobile/` (TypeScript strict, expo-router, iOS 17+ / Android 8+), React Native Firebase (app, auth, firestore, storage, functions, remote-config, analytics, crashlytics, messaging, app-check), `expo-dev-client`, ESLint + Prettier, Jest + RNTL.
- `app.config.ts` driven by `APP_ENV` → bundle IDs (`com.lumio.app.dev`, `com.lumio.app`), Firebase config files, app name; `eas.json` profiles.
- `firebase/` workspace: `firebase.json`, `.firebaserc` (dev/prod aliases), empty-deny `firestore.rules` / `storage.rules`, `functions/` TypeScript scaffold with ESLint + Vitest, emulator config.
- App connects to emulators when `EXPO_PUBLIC_USE_EMULATOR=1` (never in production builds); dev-tools screen with a **Ping backend** button calling the `ping` callable.
- **Design system v1** (`src/design-system`): tokens (colours, type scale, radii, spacing) + PillButton, CapsuleTabBar, SegmentedPill, Card, Toast, Skeleton, plus a dev-only gallery screen.
- CI (GitHub Actions): app typecheck + lint + Jest; functions lint + tests; rules tests on emulator; EAS build on main.
- Legal placeholders: Privacy Policy & Terms URLs.
**Exit:** app launches on device against dev & emulator; CI green; a hello-world callable deploys to dev.

### Phase 1 — App shell, onboarding & permissions (≈1 week)
- Splash (O1), Welcome (O2), ATT prompt (O3), first-run flag.
- expo-router `(tabs)` layout with the custom floating CapsuleTabBar: Photos, Magic AI (NEW badge via Remote Config), Videos, Settings — each a placeholder.
- Permission helpers for Photos (full/limited), Camera, Notifications with "denied → open Settings" states.
- Remote Config defaults + fetch on launch.
**Exit:** fresh install walks Splash → Welcome → ATT → tabs; works offline.

### Phase 2 — Authentication & user profile (≈1.5 weeks)
- Anonymous sign-in on first launch (everyone has a `uid` from day one).
- `onUserCreated` creates `users/{uid}`.
- Login screens A1–A4: Apple, Google, Email code. Functions `requestEmailCode` / `verifyEmailCode` (+ email provider, rate limits, hashing, attempts).
- Credential linking from anonymous; conflict handling.
- Firestore rules for `users/{uid}` (client-writable field allow-list) + rules tests.
- Settings S1 profile section, Sign out (S4) → returns to a fresh anonymous session.
**Exit:** all four auth paths work on device; anonymous data survives linking; rules tests cover allowed/denied writes.

### Phase 3 — Photos tab (≈1.5 weeks)
- H1 empty state, H2 permission, H4 grid with chips Faces/Recents/Favourites/Selfies, skeleton loading.
- `faceIndexer`: background face detection over the library via `modules/lumio-vision` (Apple Vision on iOS, ML Kit on Android), incremental, cached in SQLite; respects Limited access.
- Virtualised grid with `@shopify/flash-list` + `expo-image` thumbnails.
- Shortcuts: Camera (H5), All photos (system picker), Edited (H6, empty until Phase 4).
- Upgrade pill → paywall placeholder.
**Exit:** smooth 60 fps scrolling on a 10k-photo library; Faces chip populated within ~1 min of granting access.

### Phase 4 — On-device photo editor (≈3–4 weeks)
- `renderPipeline` on **React Native Skia** (runtime shaders, LUT textures, offscreen surfaces for full-res export); non-destructive op stack; before/after hold; undo/redo.
- `modules/lumio-vision` adds face landmarks + person segmentation masks (returned as image URIs) for Skia to consume.
- Tools: Adjust → Filters (own LUTs) → Crop → Background (segmentation blur/replace) → Retouch (landmark-guided skin smoothing, eyes, teeth, blemish heal).
- Pro flags on tools; gate at save, not at preview.
- Export pipeline honouring Export settings (S2): format, resolution caps, quality, metadata strip, date.
- Save to Photos; Edited list (H6) re-opens projects.
- Free save limit stub (local) — becomes server-backed in Phase 5.
**Exit:** edit-and-save a 12 MP portrait in < 2 s render on iPhone 12; unit tests for op-stack logic and golden-image tests for shaders on device.

### Phase 5 — Monetization: subscriptions & tokens (≈2 weeks)
- App Store Connect: subscription group (weekly, monthly, yearly + 7-day trial intro offer), consumables (tokens_150/400/900). StoreKit configuration file (via config plugin) + sandbox testers for local testing.
- `purchases` service on **react-native-iap**: load products, purchase, purchase-updated listener, `finishTransaction` only after server verification succeeds, restore, `appAccountToken = uid`.
- Functions: `verifyPurchase`, `appStoreNotifications`, `ledger.ts`, `entitlements.ts`, `recordSave`; rules for server-only fields + tests.
- Paywall P1/P2 (variant by Remote Config), Top-up sheet P3/P4, Restore, toasts.
- Settings: plan row, tokens row with Top-up, Restore Purchases, Manage subscription.
- Enforce free daily save limit via `recordSave`; Pro unlocks Pro tools & Max export.
- Show paywall after first login and on gated actions (`paywall_shown{source}`).
**Exit:** sandbox purchase of each product grants the right entitlement/tokens exactly once (replay-safe); refund notification revokes; balance can't be changed from the client (rules test).

### Phase 6 — Magic AI generation (≈3 weeks)
- **Spike (2–3 days):** pick provider/model for identity-preserving stylisation; measure quality, latency, cost per image, safety tooling. Record decision in `docs/adr/0001-generation-provider.md`.
- Content: our own style catalogue (≥ 12 styles across 3 categories, both genders), sample images we own/generate, prompts in `stylePrompts`.
- Admin seeding script (`firebase/scripts/seed-styles.ts`).
- Functions: `createGeneration`, `processGeneration` (Cloud Tasks, retries), moderation, refunds, `cleanupInputs`, `deleteCreation`, FCM push; `FakeProvider` for emulator.
- App: M1 home (gender toggle, carousels, offline cache), M2 style detail with Generate • cost and balance, M3 progress, M4 results (save/share/report), M5 My creations + empty state; notification permission ask after first generation.
**Exit:** end-to-end generation on dev in < 60 s p90; failed/blocked generations always refund (integration test); insufficient balance routes to Top-up/paywall.

### Phase 7 — Videos (≈3 weeks)
- V1 media picker sheet (multi-select photos+videos, album menu, All/Photos/Videos filter, selection tray).
- `modules/lumio-video` Expo native module: AVFoundation (`AVMutableComposition` / `AVVideoComposition`) on iOS; Android Media3 Transformer stub kept compiling.
- V2 editor (React Native UI over the native module): timeline, trim/split/reorder, photo clip duration, CI filters via `AVVideoComposition`, Pro face retouch, aspect ratios, bundled music, export presets (free 720p, Pro 1080p/4K).
- Video project persistence + "Clear Video Editor Cache".
**Exit:** 60 s 1080p export in < 30 s on iPhone 13; memory stays < 600 MB.

### Phase 8 — Settings & account management (≈1 week)
- Complete S1–S7: export settings (synced), Free up space + auto-cleanup background task, Privacy & Legal, Open-source licences, "Don't share my data", Email tips toggle, Rate app, Send feedback.
- `deleteAccount` function + S5 confirmation; verify all data removed (test).
**Exit:** every Settings row works; account deletion verified in emulator test and on dev.

### Phase 9 — Engagement, analytics & experiments (≈1 week)
- Full analytics event list (§7) with typed wrapper; funnels in Analytics.
- Remote Config / A/B tests: paywall variant, trial vs no-trial, top-up default pack.
- Push: generation ready/failed; optional re-engagement (respect Email tips/marketing consent).
- Crashlytics breadcrumbs; Performance traces for render, export, generation.
**Exit:** dashboard shows onboarding→paywall→purchase funnel from internal testers.

### Phase 10 — Hardening & compliance (≈1.5 weeks)
- Enforce App Check on all callables, Firestore and Storage.
- Rate limits (per uid/IP) on `requestEmailCode`, `createGeneration`.
- Load test generation queue; budget alerts on GCP; max-instances on functions.
- Security review of rules & functions; dependency audit.
- Accessibility (Dynamic Type, VoiceOver labels, contrast), localisation scaffolding.
- App Store requirements: privacy nutrition labels, ATT purpose string, account deletion in-app, subscription disclosure text on paywall, restore button, EULA link, AI-content reporting.
**Exit:** no open P0/P1 bugs; rules & functions test coverage ≥ 80 %; App Store review checklist complete.

### Phase 11 — Launch & post-launch
- Prod Firebase project deployed via CI with manual approval; App Store Server Notifications URL set to prod.
- Phased release; monitor crash-free sessions (≥ 99.5 %), generation failure rate (< 3 %), refund rate.
- v2 backlog: personalised avatars (multi-photo fine-tune), Android (shared backend), web share links, more video AI effects.

---

## 9. Definition of done (every feature)
- Matches the referenced screen/flow structure, using our design system and copy.
- Loading, empty, error and offline states implemented.
- Unit tests (view model / function) + rules tests where data access changes.
- Analytics events fired.
- No secrets in the client; no client writes to server-only fields.
- Works in both Dev (emulator) and Dev (cloud) configs.
