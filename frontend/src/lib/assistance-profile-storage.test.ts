import { describe, expect, it } from "vitest";
import {
  ASSISTANCE_PROFILE_STORAGE_KEY,
  DEFAULT_ASSISTANCE_PROFILE,
  LEGACY_ACCESSIBILITY_STORAGE_KEY,
  loadAssistanceProfile,
  saveAssistanceProfile,
} from "./assistance-profile-storage";

function createStorage(values: Record<string, string> = {}) {
  return {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => {
      values[key] = value;
    },
  };
}

describe("assistance profile storage", () => {
  it("저장값이 없거나 손상되면 안전한 기본값을 사용한다", () => {
    expect(loadAssistanceProfile(createStorage())).toEqual(
      DEFAULT_ASSISTANCE_PROFILE,
    );
    expect(
      loadAssistanceProfile(
        createStorage({ [ASSISTANCE_PROFILE_STORAGE_KEY]: "{" }),
      ),
    ).toEqual(DEFAULT_ASSISTANCE_PROFILE);
  });

  it("기존 접근성 설정을 새 프로필로 변환한다", () => {
    const profile = loadAssistanceProfile(
      createStorage({
        [LEGACY_ACCESSIBILITY_STORAGE_KEY]: JSON.stringify({
          largeText: true,
          voiceGuide: true,
        }),
      }),
    );

    expect(profile).toEqual({
      ...DEFAULT_ASSISTANCE_PROFILE,
      textScale: "large",
      isVoiceGuideEnabled: true,
    });
  });

  it("허용되지 않은 값만 기본값으로 복구한다", () => {
    const profile = loadAssistanceProfile(
      createStorage({
        [ASSISTANCE_PROFILE_STORAGE_KEY]: JSON.stringify({
          guidanceLevel: "automatic",
          preferredLanguage: "ja",
          textScale: "huge",
          isHighContrastEnabled: true,
        }),
      }),
    );

    expect(profile).toEqual({
      ...DEFAULT_ASSISTANCE_PROFILE,
      isHighContrastEnabled: true,
    });
  });

  it("저장소 오류를 화면 기능의 예외로 전파하지 않는다", () => {
    expect(
      saveAssistanceProfile(
        {
          setItem: () => {
            throw new Error("quota exceeded");
          },
        },
        DEFAULT_ASSISTANCE_PROFILE,
      ),
    ).toBe(false);
  });
});
