export type SpeedPreset = 'normal' | 'slow' | 'very_slow';

export const SPEED_RATES: Record<SpeedPreset, number> = {
  normal: 0.85,
  slow: 0.65,
  very_slow: 0.45,
};

export interface PronunciationOptions {
  speed?: SpeedPreset | number;
  pitch?: number;
  volume?: number;
  delayBetweenWordsMs?: number;
  wordByWord?: boolean;
}

export function cleanJapaneseText(text: string): string {
  if (!text) return '';
  // Remove furigana readings in brackets like 漢字（かんじ） or 漢字(かんじ)
  return text.replace(/（[^）]+）/g, '').replace(/\([^\)]+\)/g, '').trim();
}

export function splitIntoWords(sentence: string): string[] {
  const cleaned = cleanJapaneseText(sentence);
  // Split on common particles, spaces, or punctuation for word-by-word playback
  const parts = cleaned.split(/(は|が|を|に|で|と|も|の|です|ます|か|。|、|\s+)/).filter(Boolean);
  return parts;
}
