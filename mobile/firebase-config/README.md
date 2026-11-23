# Firebase client config files

Download from the Firebase console (Project settings → Your apps) and place:

| File | Firebase project | App id |
|---|---|---|
| `dev/GoogleService-Info.plist` | `lumio-dev` | iOS `com.lumio.app.dev` |
| `dev/google-services.json` | `lumio-dev` | Android `com.lumio.app.dev` |
| `prod/GoogleService-Info.plist` | `lumio-prod` | iOS `com.lumio.app` |
| `prod/google-services.json` | `lumio-prod` | Android `com.lumio.app` |

These files are not secret and may be committed. They are required for any native
build (`npx expo prebuild` / `expo run:*` / `eas build`), even when the app talks to the
local emulators (`EXPO_PUBLIC_USE_EMULATOR=1`), because React Native Firebase initialises
from them at launch.
