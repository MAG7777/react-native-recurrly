type PostHogConsentLike = {
  optedOut?: boolean;
} | null | undefined;

const normalizeIdentifier = (value: string) => value.trim().toLowerCase();

const hashValue = (value: string) => {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
};

export const getHashedIdentifier = (value: string) => {
  const normalized = normalizeIdentifier(value);
  return normalized ? `anon_${hashValue(normalized)}` : "anon_unknown";
};

export const hasAnalyticsConsent = (posthog: PostHogConsentLike) => posthog?.optedOut === false;
