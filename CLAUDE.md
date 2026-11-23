# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is
**Lumio** (working name) — an AI photo & video editor for portraits, modelled on the *flows* of Lensa, built with **React Native (Expo)** and a **Firebase** backend. iOS ships first; Android builds from the same code and must stay green.
**`SPEC.md` is the source of truth** for features, screens, data model, functions and the phased build plan. Read the relevant section before starting any task.

## Current phase
`Phase 0 — Foundations` (update this line when a phase's exit criteria are met).
Work only on the current phase unless the user says otherwise. Don't scaffold future-phase features "while you're there".

## Stack (summary — details in SPEC.md §2)
- App: Expo SDK 58, React Native, TypeScript strict, expo-router, React Native Firebase, Zustand, TanStack Query, Reanimated, Gesture Handler, React Native Skia, expo-sqlite, MMKV, react-native-iap.
- Expo-specific agent guidance (always use `npx expo install`, check versioned Expo docs) is in `mobile/AGENTS.md`.
- Native code only via **Expo native modules** in `mobile/modules/*` and **config plugins** — never hand-edit generated `ios/` / `android/` folders (they are gitignored; `npx expo prebuild` recreates them).
- Backend: Firebase Auth, Firestore, Storage, Cloud Functions 2nd gen (TypeScript, Node 22), Remote Config, FCM, App Check, Crashlytics, Analytics.
- Two Firebase projects: `lumio-dev`, `lumio-prod`; the emulator uses `demo-lumio`. Never deploy to prod from a local machine.

## Repo layout
```
mobile/                 Expo app (see SPEC.md §6)
  src/app/              expo-router routes — thin, delegate to src/features
  src/design-system/    tokens + components (only place colours/fonts are defined)
  src/features/<name>/  feature UI, hooks, tests
  src/services/         service interfaces + firebase/, purchases/, media/ implementations
  src/lib/              env, errors, logger
  modules/              Expo native modules (lumio-vision, lumio-video)
  firebase-config/      dev|prod GoogleService-Info.plist / google-services.json
firebase/
  firebase.json  .firebaserc  firestore.rules  firestore.indexes.json  storage.rules
  functions/src/        auth/ iap/ generation/ account/ usage/ lib/
  rules-tests/          @firebase/rules-unit-testing suites
  scripts/              seeding & admin scripts
docs/adr/               architecture decision records
SPEC.md  CLAUDE.md
```

## Commands
```bash
# App (from mobile/)
npm run typecheck && npm run lint && npm test     # tsc, eslint, jest
npx expo run:ios                                   # local dev build (needs Xcode)
npx expo run:android                               # local dev build (needs Android SDK)
npx expo start --dev-client                        # Metro for an installed dev build
eas build --profile development --platform ios     # cloud dev build (no local Xcode needed)

# Backend (from firebase/)
npm run emulators                                  # auth 9099, firestore 8085, storage 9199, functions 5001, UI 4000
npm run test:rules                                 # rules tests against emulator
cd functions && npm run lint && npm test && npm run build
firebase deploy --only functions -P dev
```
Firestore emulator uses port **8085** (8080 is taken on the dev machine). Update this section if commands change.

## Non-negotiable rules
1. **The server owns money.** `tokenBalance`, `entitlement`, `ledger`, `purchases`, `usage`, `generations` are written **only** by Cloud Functions. Only `functions/src/lib/ledger.ts` may change `tokenBalance`, always inside a Firestore transaction that also writes a ledger entry.
2. **Every token debit has a refund path.** Failed/blocked generations refund in the same transaction that marks them failed.
3. **Idempotency everywhere:** purchases keyed by `transactionId`, generations by client-generated `genId`, task handlers no-op on terminal status. Call `finishTransaction` only after the server verified the purchase.
4. **Security rules are default-deny** and every rules change ships with rules tests (allowed *and* denied cases).
5. **Never trust the client** for prices, costs, entitlements or limits. Display prices come from the store via react-native-iap; costs from `config/pricing` / Remote Config.
6. **No secrets in the app or repo.** Anything `EXPO_PUBLIC_*` ends up in the bundle — never put keys there. Server secrets use `defineSecret`. Firebase client config files are fine to commit; service-account JSON never.
7. **Faces are sensitive data.** Strip EXIF and downscale (≤ 2048 px) before upload; inputs auto-delete after 24 h; never log image URLs or user emails.
8. **Do not use Lensa's name, logo, copy, style artwork or sample images.** Motvin screens are for layout/flow reference only.
9. New callables use `enforceAppCheck: true` from the start (emulator/dev builds use the App Check debug provider).

## App conventions
- TypeScript strict, no `any`, no non-null `!` outside tests. Function components + hooks only.
- Route files in `src/app/` stay thin: they render a feature screen from `src/features`. Screen logic lives in a `useXxxScreen` hook that is unit-tested.
- Only `src/services/firebase/*` may import `@react-native-firebase/*`. Features use service interfaces from `useServices()`; tests and the gallery inject fakes.
- Server data via TanStack Query or Firestore-listener hooks; UI/session state in Zustand. No prop-drilling of services.
- Styling: `StyleSheet.create` + tokens from `src/design-system`. No inline hex colours or magic font sizes in features.
- Animations with Reanimated (UI thread); gestures with Gesture Handler; heavy image work in Skia or native modules — never pixel loops in JS.
- Every screen implements loading, empty, error and offline states and has accessibility labels.
- User-facing strings go through the i18n helper (added in Phase 1).

## Functions conventions
- TypeScript strict, ESM; one file per function under its domain folder; export from `src/index.ts`.
- Callables: `onCall({ region: REGION, enforceAppCheck: true, maxInstances, timeoutSeconds }, …)`, validate input with `zod`, throw `HttpsError` with stable codes.
- Shared logic lives in `src/lib/`; functions stay thin.
- AI calls go through the `GenerationProvider` interface; tests and the emulator use `FakeProvider`.
- Structured logs (`logger.info({ uid, genId })`) — no PII beyond uid.

## Using the Motvin MCP for UI reference
The reference app is Lensa on iOS (`app: "lensa"`, `platform: "ios"`, captured 2026-10-27):
- `get_app { app: "lensa", platform: "ios" }` — list of flows
- `get_flow { flow_id: "lensa-ios-versions-2026-10-27-<flow>" }` — flows: `onboarding`, `granting-app-permissions`, `photos`, `magic-ai`, `opening-a-page-photos` (style preview), `logging-in-with-email`, `subscribing`, `placing-an-order` (token top-up), `videos`, `settings`
- `search_screens { platform: "ios", query: "..." }` — patterns from other apps for screens Lensa's capture doesn't cover (photo editor tools, generation progress, results, video timeline). Name the app when citing a pattern.

Before building a screen, open its referenced flow from SPEC.md §4 and match structure and states — then apply our own design system and copy.

## Workflow
- Small, reviewable changes. Run typecheck + lint + tests before saying a task is done; say plainly if something wasn't run or verified (e.g. no device build).
- When a phase's exit criteria are met, update **Current phase** above and tick the phase in SPEC.md.
- Record significant decisions (provider choice, native module design) as ADRs in `docs/adr/NNNN-title.md`.
- If SPEC.md and the code disagree, ask before changing either.
