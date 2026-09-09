import type { AssistanceProfile, GuidanceLevel } from "@/domain/types";

export const ASSISTANCE_PROFILE_STORAGE_KEY = "bada-assistance-profile";
export const LEGACY_ACCESSIBILITY_STORAGE_KEY = "bada-accessibility";

export const DEFAULT_ASSISTANCE_PROFILE: AssistanceProfile = {
  guidanceLevel: "detailed",
  preferredLanguage: "ko",
  textScale: "default",
  isVoiceGuideEnabled: false,
  isHighContrastEnabled: false,
  isReducedMotionEnabled: false,
};

interface StorageReader {
  getItem: (key: string) => string | null;
}

interface StorageWriter {
  setItem: (key: string, value: string) => void;
}

const GUIDANCE_LEVELS: GuidanceLevel[] = ["detailed", "essential", "standard"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStoredValue(
  value: string | null,
): Record<string, unknown> | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeProfile(value: Record<string, unknown>): AssistanceProfile {
  return {
    guidanceLevel: GUIDANCE_LEVELS.includes(
      value.guidanceLevel as GuidanceLevel,
    )
      ? (value.guidanceLevel as GuidanceLevel)
      : DEFAULT_ASSISTANCE_PROFILE.guidanceLevel,
    preferredLanguage: value.preferredLanguage === "en" ? "en" : "ko",
    textScale:
      value.textScale === "large" || value.largeText === true
        ? "large"
        : "default",
    isVoiceGuideEnabled:
      value.isVoiceGuideEnabled === true || value.voiceGuide === true,
    isHighContrastEnabled: value.isHighContrastEnabled === true,
    isReducedMotionEnabled: value.isReducedMotionEnabled === true,
  };
}

export function loadAssistanceProfile(
  storage: StorageReader,
): AssistanceProfile {
  const currentValue = parseStoredValue(
    storage.getItem(ASSISTANCE_PROFILE_STORAGE_KEY),
  );
  if (currentValue) return normalizeProfile(currentValue);

  const legacyValue = parseStoredValue(
    storage.getItem(LEGACY_ACCESSIBILITY_STORAGE_KEY),
  );
  return legacyValue
    ? normalizeProfile(legacyValue)
    : DEFAULT_ASSISTANCE_PROFILE;
}

export function saveAssistanceProfile(
  storage: StorageWriter,
  profile: AssistanceProfile,
): boolean {
  try {
    storage.setItem(ASSISTANCE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}
