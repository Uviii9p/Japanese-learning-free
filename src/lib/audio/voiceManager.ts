export interface VoiceInfo {
  voice: SpeechSynthesisVoice | null;
  name: string;
  lang: string;
  isFemale: boolean;
  isHighQuality: boolean;
  isJapanese: boolean;
}

export interface VoiceStatus {
  status: 'loading' | 'available' | 'unavailable';
  selectedVoice: VoiceInfo | null;
  allVoices: SpeechSynthesisVoice[];
  japaneseVoices: SpeechSynthesisVoice[];
  error: string | null;
}

type VoiceChangeListener = (status: VoiceStatus) => void;

class VoiceManager {
  private listeners: Set<VoiceChangeListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
  }

  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const update = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.isInitialized = true;
      this.notifyListeners();
    };

    update();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = update;
    }

    // Chrome/Safari double check after short delay
    setTimeout(update, 500);
    setTimeout(update, 1500);
  }

  public subscribe(listener: VoiceChangeListener): () => void {
    this.listeners.add(listener);
    // Send initial status
    listener(this.getStatus());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const status = this.getStatus();
    this.listeners.forEach(l => l(status));
  }

  public getStatus(): VoiceStatus {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {
        status: 'unavailable',
        selectedVoice: null,
        allVoices: [],
        japaneseVoices: [],
        error: 'Speech synthesis is not supported in this browser environment.'
      };
    }

    if (this.voices.length === 0 && !this.isInitialized) {
      return {
        status: 'loading',
        selectedVoice: null,
        allVoices: [],
        japaneseVoices: [],
        error: null
      };
    }

    const jaVoices = this.voices.filter(v =>
      v.lang.toLowerCase().includes('ja') ||
      v.lang.toLowerCase().includes('jp') ||
      v.name.toLowerCase().includes('japan')
    );

    const bestVoice = this.rankBestJapaneseVoice(jaVoices);

    if (!bestVoice && jaVoices.length === 0) {
      return {
        status: 'unavailable',
        selectedVoice: null,
        allVoices: this.voices,
        japaneseVoices: [],
        error: 'No Japanese voice detected in your browser/device settings. Please install a Japanese system voice.'
      };
    }

    return {
      status: 'available',
      selectedVoice: bestVoice ? this.formatVoiceInfo(bestVoice) : null,
      allVoices: this.voices,
      japaneseVoices: jaVoices,
      error: null
    };
  }

  public rankBestJapaneseVoice(jaVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (jaVoices.length === 0) return null;

    // High quality & female keywords
    const femaleKeywords = ['kyoko', 'nanami', 'mayu', 'haruka', 'ayumi', 'google 日本語', 'female', 'woman', 'sakura', 'yuki', 'natural', 'enhanced', 'premium'];
    const qualityKeywords = ['google', 'natural', 'enhanced', 'premium', 'online', 'neural'];

    let bestVoice: SpeechSynthesisVoice | null = null;
    let highestScore = -1;

    for (const voice of jaVoices) {
      let score = 0;

      const nameLower = voice.name.toLowerCase();

      // Language accuracy
      if (voice.lang === 'ja-JP' || voice.lang === 'ja_JP') score += 50;

      // Female indicator
      if (femaleKeywords.some(kw => nameLower.includes(kw))) score += 40;

      // High quality / neural / Google indicator
      if (qualityKeywords.some(kw => nameLower.includes(kw))) score += 20;

      // Default voice bonus
      if (voice.default) score += 5;

      if (score > highestScore) {
        highestScore = score;
        bestVoice = voice;
      }
    }

    return bestVoice || jaVoices[0];
  }

  private formatVoiceInfo(voice: SpeechSynthesisVoice): VoiceInfo {
    const nameLower = voice.name.toLowerCase();
    const femaleKeywords = ['kyoko', 'nanami', 'mayu', 'haruka', 'ayumi', 'google 日本語', 'female', 'woman', 'sakura'];
    const isFemale = femaleKeywords.some(kw => nameLower.includes(kw)) || true; // Pitch tuned for female timbre

    return {
      voice,
      name: voice.name,
      lang: voice.lang,
      isFemale,
      isHighQuality: nameLower.includes('natural') || nameLower.includes('google') || nameLower.includes('enhanced') || nameLower.includes('premium'),
      isJapanese: voice.lang.includes('ja') || voice.lang.includes('JP'),
    };
  }
}

export const voiceManager = new VoiceManager();
