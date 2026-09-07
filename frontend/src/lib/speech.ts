const KOREAN_LANGUAGE_PREFIX = "ko";

const NATURAL_VOICE_KEYWORDS = [
  "natural",
  "online",
  "google",
  "sunhi",
  "heami",
  "유미",
  "선희",
];

export const KOREAN_SPEECH_RATE = 0.85;
export const KOREAN_SPEECH_PITCH = 1.05;

const getVoiceScore = (voice: SpeechSynthesisVoice): number => {
  const normalizedName = voice.name.toLowerCase();
  const isKoreanVoice = voice.lang.toLowerCase().startsWith(KOREAN_LANGUAGE_PREFIX);

  if (!isKoreanVoice) return -1;

  const qualityScore = NATURAL_VOICE_KEYWORDS.reduce(
    (score, keyword, index) =>
      normalizedName.includes(keyword)
        ? Math.max(score, NATURAL_VOICE_KEYWORDS.length - index)
        : score,
    0,
  );
  const localeScore = voice.lang.toLowerCase() === "ko-kr" ? 2 : 0;
  const localServiceScore = voice.localService ? 0 : 1;

  return qualityScore * 10 + localeScore + localServiceScore;
};

export const selectKoreanVoice = (
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined =>
  voices
    .map((voice) => ({ voice, score: getVoiceScore(voice) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score)[0]?.voice;
