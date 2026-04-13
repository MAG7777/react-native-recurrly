<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurly React Native (Expo) app. Here is a summary of all changes made:

## Changes summary

- **`app.config.js`** (new) — Created to replace static `app.json` with a dynamic config that injects `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` into `expo-constants` extras at build time.
- **`src/config/posthog.ts`** (new) — PostHog client singleton configured with `captureAppLifecycleEvents`, batching, feature flags, and graceful disabling if the token is missing.
- **`app/_layout.tsx`** — Wrapped the app tree with `PostHogProvider` (autocapture of touches enabled, screen tracking disabled in favor of manual tracking). Added `ScreenTracker` component for manual Expo Router screen tracking via `posthog.screen()`.
- **`app/(auth)/sign-in.tsx`** — Added `sign_in_completed` (with `posthog.identify()`), `sign_in_failed`, and `$exception` capture for unexpected errors.
- **`app/(auth)/sign-up.tsx`** — Added `sign_up_completed` (with `posthog.identify()` and `$set_once` for first sign-up date), `sign_up_failed`.
- **`app/(tabs)/settings.tsx`** — Added `sign_out` event and `posthog.reset()` on sign-out to clear the user identity.
- **`app/(tabs)/index.tsx`** — Added `subscription_card_expanded` and `subscription_card_collapsed` events with `subscription_id` and `subscription_name` properties.
- **`app/subscriptions/[id].tsx`** — Added `subscription_details_viewed` event with `subscription_id` property on mount.
- **`app/(tabs)/insights.tsx`** — Added `insights_viewed` event on mount (top of analytics funnel).
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (covered by `.gitignore`).

## Event tracking table

| Event | Description | File |
|---|---|---|
| `sign_up_completed` | User successfully created an account and verified their email | `app/(auth)/sign-up.tsx` |
| `sign_up_failed` | User encountered an error during sign-up | `app/(auth)/sign-up.tsx` |
| `sign_in_completed` | User successfully signed in to their account | `app/(auth)/sign-in.tsx` |
| `sign_in_failed` | User encountered an error during sign-in | `app/(auth)/sign-in.tsx` |
| `sign_out` | User signed out of their account | `app/(tabs)/settings.tsx` |
| `subscription_card_expanded` | User expanded a subscription card to view details | `app/(tabs)/index.tsx` |
| `subscription_card_collapsed` | User collapsed a subscription card | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User viewed the subscription details screen | `app/subscriptions/[id].tsx` |
| `insights_viewed` | User navigated to the insights tab | `app/(tabs)/insights.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/158373/dashboard/618369
- **Sign-up → Sign-in Conversion Funnel**: https://eu.posthog.com/project/158373/insights/xDHZXr8d
- **Daily Sign-ins vs Failed Sign-ins**: https://eu.posthog.com/project/158373/insights/DAWZMl2M
- **Daily Sign-outs (Churn Signal)**: https://eu.posthog.com/project/158373/insights/bBal6Cte
- **Subscription Card Engagement**: https://eu.posthog.com/project/158373/insights/dyVC4unD
- **Weekly Auth Activity (Sign-ups, Sign-ins, Sign-outs)**: https://eu.posthog.com/project/158373/insights/Djkdve4c

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
