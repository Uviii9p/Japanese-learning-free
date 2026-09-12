import { voiceManager, VoiceStatus } from './voiceManager';
import { cleanJapaneseText, SPEED_RATES, SpeedPreset } from './pronunciation';

export interface SpeakRequestOptions {
  rate?: number | SpeedPreset;
  pitch?: number;
  volume?: number;
  style?: 'gentle' | 'teacher' | 'friendly' | 'energetic';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export type PlayState = 'idle' | 'loading' | 'playing' | 'error';

type PlayStateListener = (state: PlayState, currentText: string | null) => void;

class JapaneseVoiceEngine {
  private currentState: PlayState = 'idle';
  private currentText: string | null = null;
  private stateListeners: Set<PlayStateListener> = new Set();
  private isSpeakingInternal = false;
  private currentAudioElement: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      voiceManager.initVoices();
    }
  }

  public subscribeState(listener: PlayStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState, this.currentText);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: PlayState, text: string | null = null) {
    this.currentState = state;
    this.currentText = text;
    this.stateListeners.forEach(l => l(state, text));
  }

  public cancel(): void {
    if (typeof window === 'undefined') return;

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      } catch (e) {
        console.warn('[AUDIO] Error pausing audio element:', e);
      }
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('[AUDIO] Error cancelling synthesis:', e);
      }
    }

    this.isSpeakingInternal = false;
    this.setState('idle', null);
  }

  public async speak(text: string, options: SpeakRequestOptions = {}): Promise<void> {
    if (typeof window === 'undefined') return;

    const cleanedText = cleanJapaneseText(text);
    if (!cleanedText) return;

    // Cancel any active speech to avoid overlapping
    this.cancel();
    this.setState('loading', cleanedText);

    // Resolve rate
    let rateNum = 0.85;
    if (typeof options.rate === 'number') {
      rateNum = options.rate;
    } else if (typeof options.rate === 'string' && options.rate in SPEED_RATES) {
      rateNum = SPEED_RATES[options.rate as SpeedPreset];
    }

    let pitchNum = options.pitch ?? 1.05;
    if (options.style === 'gentle') pitchNum = 1.0;
    else if (options.style === 'teacher') pitchNum = 1.08;
    else if (options.style === 'friendly') pitchNum = 1.15;
    else if (options.style === 'energetic') pitchNum = 1.22;

    // Strategy 1: Free Online AI Japanese Female Voice Audio Stream
    const freeAIAudioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanedText)}&tl=ja&client=tw-ob`;

    const playOnlineAIAudio = (): Promise<boolean> => {
      return new Promise((resolve) => {
        try {
          const audio = new Audio(freeAIAudioUrl);
          audio.playbackRate = Math.max(0.5, Math.min(2.0, rateNum));
          audio.volume = options.volume ?? 1.0;
          this.currentAudioElement = audio;

          audio.onplay = () => {
            this.isSpeakingInternal = true;
            this.setState('playing', cleanedText);
            options.onStart?.();
          };

          audio.onended = () => {
            this.isSpeakingInternal = false;
            this.currentAudioElement = null;
            this.setState('idle', null);
            options.onEnd?.();
            resolve(true);
          };

          audio.onerror = () => {
            this.currentAudioElement = null;
            resolve(false); // Fallback to SpeechSynthesis
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => resolve(false));
          }
        } catch (e) {
          resolve(false);
        }
      });
    };

    const onlineSuccess = await playOnlineAIAudio();
    if (onlineSuccess) return;

    // Strategy 2: Web Speech Synthesis Fallback with Female Voice selection
    if ('speechSynthesis' in window) {
      const status = voiceManager.getStatus();
      const targetVoice = status.selectedVoice?.voice || voiceManager.rankBestJapaneseVoice(status.japaneseVoices);

      return new Promise<void>((resolve) => {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanedText);
          utterance.lang = 'ja-JP';
          utterance.rate = Math.max(0.3, Math.min(2, rateNum));
          utterance.pitch = Math.max(0.5, Math.min(1.5, pitchNum));
          utterance.volume = options.volume ?? 1.0;

          if (targetVoice) {
            utterance.voice = targetVoice;
          }

          utterance.onstart = () => {
            this.isSpeakingInternal = true;
            this.setState('playing', cleanedText);
            options.onStart?.();
          };

          utterance.onend = () => {
            this.isSpeakingInternal = false;
            this.setState('idle', null);
            options.onEnd?.();
            resolve();
          };

          utterance.onerror = (event) => {
            console.warn('[AUDIO] Synthesis error:', event);
            this.isSpeakingInternal = false;
            this.setState('idle', null);
            options.onError?.(event);
            resolve();
          };

          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error('[AUDIO] Exception:', err);
          this.setState('error');
          options.onError?.(err);
          resolve();
        }
      });
    }

    this.setState('idle');
  }

  public async speakWordByWord(text: string, delayMs: number = 400, options: SpeakRequestOptions = {}): Promise<void> {
    const words = cleanJapaneseText(text).split(/(は|が|を|に|で|と|も|の|です|ます|。|、|\s+)/).filter(w => w.trim().length > 0);

    for (const word of words) {
      if (this.currentState === 'idle' && this.isSpeakingInternal === false && words.indexOf(word) > 0) {
        break;
      }
      await this.speak(word, options);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  public isPlaying(): boolean {
    return this.currentState === 'playing' || this.currentState === 'loading';
  }

  public getCurrentText(): string | null {
    return this.currentText;
  }
}

export const japaneseVoiceEngine = new JapaneseVoiceEngine();
