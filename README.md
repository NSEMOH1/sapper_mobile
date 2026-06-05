# Sapper Mobile

A React Native (Expo bare workflow) app for managing savings, loans, payments, and withdrawals.

---

## Tech Stack

| | |
|---|---|
| Framework | React Native + Expo (bare workflow) |
| Router | Expo Router |
| Data Fetching | TanStack React Query |
| Package Manager | Bun |
| Language | TypeScript |

---

## Project Structure

```
assets/
scripts/
src/
├── lib/
│   ├── queryClient.ts       ← QueryClient config (staleTime, gcTime, retry)
│   └── queryKeys.ts         ← Single source of truth for all cache keys
├── services/
│   └── api.service.ts       ← Pure async fetch functions (no hooks)
├── hooks/
│   ├── useAuth.tsx          ← useLogin(), useLogout(), useSession()
│   ├── useBalances.ts       ← useBalances()
│   ├── useLoan.ts           ← useLoanBalances()
│   ├── useSavings.ts        ← useSavingsBalance()
│   └── useMember.ts         ← useMember(userId)
└── app/
    ├── _layout.tsx          ← QueryClientProvider wraps the whole app
    ├── (tabs)/
    │   └── index.tsx
    ├── auth/
    │   └── login.tsx        ← Uses useLogin() mutation
    ├── payments/
    │   └── index.tsx
    ├── withdrawal/
    │   └── index.tsx
    └── welcome/
        └── index.tsx
```

---

## Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** ≥ 18
- **Bun** → [bun.sh](https://bun.sh)
- **Expo CLI** → `bun install -g expo-cli`
- **EAS CLI** → `bun install -g eas-cli`
- **Android Studio** + Android SDK (for Android builds)
- **Xcode** (Mac only, for iOS builds)

### Android SDK Setup (required for local Android builds)

Add to your `~/.zshenv` (persists across all shell types including non-interactive):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

Apply immediately:

```bash
source ~/.zshenv
```

Also create `android/local.properties` as a fallback:

```bash
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

---

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Generate native folders (first time only)

If `android/` and `ios/` folders don't exist:

```bash
bunx expo prebuild --clean
```

You'll be prompted for:
- **Bundle identifier** (iOS) e.g. `com.sappers.app`
- **Package name** (Android) e.g. `com.sappers.app`

---

## Development

### Start the dev server

```bash
bunx expo start
```

### Run on Android (physical device or emulator)

```bash
bunx expo run:android
```

### Run on iOS Simulator (Mac only)

```bash
cd ios && pod install && cd ..
bunx expo run:ios
```

### Run on specific simulator

```bash
# List available simulators
xcrun simctl list devices

bunx expo run:ios --simulator "iPhone 15 Pro"
```

---

## Building

### Development Build (with dev client)

Use this for testing with full native modules on a real device.

```bash
# Android APK (dev)
eas build --profile development --platform android --local

# iOS (dev, simulator)
eas build --profile development --platform ios --local
```

### Preview Build (internal distribution)

Use this for sharing with testers before going to the store.

```bash
# Android APK
eas build --profile preview --platform android --local

# iOS
eas build --profile preview --platform ios --local
```

### Production Build — AAB (Google Play)

```bash
eas build --profile production --platform android --local
```

Output path:
```
build-<timestamp>.aab
```

### Production Build — IPA (App Store, Mac only)

```bash
eas build --profile production --platform ios --local
```

---

## Converting AAB → APK (for direct device install)

EAS produces an `.aab` for production. To install directly on a device, convert it to a universal APK.

### Step 1 — Install bundletool

```bash
brew install bundletool
```

### Step 2 — Get your keystore credentials

```bash
eas credentials
```

Select: **Android → production → Keystore → Download**

Note the keystore path, keystore password, key alias, and key password.

### Step 3 — Build universal APK

```bash
bundletool build-apks \
  --bundle=build-<timestamp>.aab \
  --output=app.apks \
  --ks=/path/to/keystore.jks \
  --ks-pass=pass:KEYSTORE_PASSWORD \
  --ks-key-alias=KEY_ALIAS \
  --key-pass=pass:KEY_PASSWORD \
  --mode=universal
```

### Step 4 — Extract the APK

```bash
cp app.apks app.zip
unzip app.zip -d apk-output
# APK is at: apk-output/universal.apk
```

### Step 5 — Install on device

```bash
adb install apk-output/universal.apk
```

---

## EAS Configuration (`eas.json`)

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": {}
    }
  }
}
```

---

## Data Fetching (TanStack React Query)

The app uses TanStack React Query for all server state. The old Zustand stores (`balance.ts`, `loan.ts`, `savings.ts`, `user.ts`) have been replaced.

### Key behaviours

| Behaviour | Detail |
|---|---|
| Stale window | 2 minutes — data served from cache with zero network overhead |
| Garbage collection | 10 minutes — unmounted queries stay in memory for fast back-navigation |
| Auto-retry | Failed requests retry twice (1s → 2s → 4s, capped at 10s) |
| Background refresh | Stale queries refetch when user returns to app or reconnects |
| Deduplication | Multiple components using the same hook fire only one network request |

### Reading data in a screen

```tsx
import { useBalances } from "@/hooks/useBalances";

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useBalances();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView onRetry={refetch} />;

  return <Text>Savings: ₦{data.savings_balance.toLocaleString()}</Text>;
}
```

### Triggering a mutation

```tsx
const { mutate, isPending, error } = useLogin();

<Button
  onPress={() => mutate({ service_number, password })}
  disabled={isPending}
  title={isPending ? "Signing in…" : "Sign in"}
/>
```

### Invalidating cache after a mutation

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const queryClient = useQueryClient();

// Inside mutation onSuccess:
queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
```

### Session rehydration

```tsx
import { useSession } from "@/hooks/useAuth";

export default function Index() {
  const { data: user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      router.replace(user ? "/(tabs)" : "/welcome");
    }
  }, [user, isLoading]);

  return <SplashScreen />;
}
```

---

## Common Commands Reference

| Task | Command |
|---|---|
| Install dependencies | `bun install` |
| Generate native folders | `bunx expo prebuild --clean` |
| Start dev server | `bunx expo start` |
| Run on Android | `bunx expo run:android` |
| Run on iOS | `bunx expo run:ios` |
| Dev build (Android) | `eas build --profile development --platform android --local` |
| Preview build (Android) | `eas build --profile preview --platform android --local` |
| Production AAB | `eas build --profile production --platform android --local` |
| Production IPA | `eas build --profile production --platform ios --local` |
| Convert AAB → APK | `bundletool build-apks --mode=universal ...` |
| Install APK on device | `adb install apk-output/universal.apk` |
| View EAS credentials | `eas credentials` |

---

## Troubleshooting

### `SDK location not found`
Your `ANDROID_HOME` is not set or not persisting. Add it to `~/.zshenv` (not just `~/.zshrc`) and create `android/local.properties`:
```bash
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

### `ANDROID_HOME` not persistent after restart
Use `~/.zshenv` instead of `~/.zshrc`. Oh My Zsh and non-interactive shells (used by EAS local) only load `.zshenv`:
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshenv
source ~/.zshenv
```

### Gradle build fails
```bash
cd android
./gradlew clean
cd ..
eas build --profile production --platform android --local
```

### iOS pod install fails
```bash
cd ios
pod deintegrate
pod install
cd ..
```