# Lumio

AI photo & video editor for portraits — React Native (Expo) app + Firebase backend.

- **Spec & build phases:** [SPEC.md](SPEC.md)
- **Working conventions (also read by Claude Code):** [CLAUDE.md](CLAUDE.md)
- `mobile/` — Expo app · `firebase/` — rules, functions, emulator config · `docs/` — ADRs, legal drafts

## Quick start
```bash
cd firebase && npm install && (cd functions && npm install && npm run build)
npm run emulators              # in one terminal
cd mobile && npm install
cp .env.example .env.local     # emulator on by default for dev
npx expo run:ios               # needs Xcode + firebase-config/dev/GoogleService-Info.plist
```
