## Get started

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bunx expo start
   ```

---

## React Query Migration Guide

## What changed and why

### The problems with the original approach

| Issue | Impact |
|---|---|
| `useTokenStorage()` called inside a Zustand factory | Illegal hook call — crashes at runtime outside React components |
| Interceptors commented out in `_layout.tsx` | No `Authorization` header was ever sent; all authenticated requests failed silently |
| Manual `useEffect` + `fetchX()` in every hook | No deduplication — the same endpoint fires multiple times when multiple components mount |
| No caching | Every screen mount triggers a fresh network request |
| No background refresh | Data goes stale without the user knowing |
| Error state reset on remount | Errors vanish before the user can act on them |

---

## New file map

```
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
    └── (tabs)/
        └── index.tsx        ← 
    └── auth/
        └── login.tsx        ← Uses useLogin() mutation
    └── payments/
        └── index.tsx        ← payments
    └── withdrawal/
        └── index.tsx        ← Uses useLogin() mutation
    └── welcome/
        └── index.tsx        ← Uses useLogin() mutation
```

The old Zustand stores in `src/store/` (`balance.ts`, `loan.ts`, `savings.ts`, `user.ts`) are **replaced** by the hooks above. You can delete them.

---

## Installation

```bash
bun add @tanstack/react-query
```

---

## Usage patterns

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

### Triggering a mutation (login, withdrawal, etc.)

```tsx
const { mutate, isPending, error } = useLogin();

<Button
  onPress={() => mutate({ service_number, password })}
  disabled={isPending}
  title={isPending ? "Signing in…" : "Sign in"}
/>
```

### Invalidating cache after a mutation

After a successful loan application, invalidate loan data so it refetches:

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const queryClient = useQueryClient();
// Inside mutation onSuccess:
queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
```

### Session rehydration

Call `useSession()` once at the app entry point (e.g. `src/app/index.tsx`):

```tsx
import { useSession } from "@/hooks/useAuth";
import { useEffect } from "react";
import { router } from "expo-router";

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

## Key behaviours

- **2-minute stale window** — data fetched within the last 2 minutes is served from cache with zero network overhead.
- **10-minute garbage collection** — unmounted queries stay in memory for 10 minutes, so navigating back is instant.
- **Auto-retry** — failed requests retry twice with exponential backoff (1s → 2s → 4s, capped at 10s).
- **Background refresh** — when the user returns to the app or reconnects to the internet, stale queries silently refetch.
- **Deduplication** — if `useBalances()` is mounted in 5 components simultaneously, only one network request fires.