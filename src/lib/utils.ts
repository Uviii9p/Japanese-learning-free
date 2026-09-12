import { japaneseVoiceEngine } from './audio/JapaneseVoiceEngine';
import { SpeedPreset } from './audio/pronunciation';

// Central Japanese TTS Delegation
export function speakJapanese(
  text: string,
  rate: number | SpeedPreset = 'normal',
  style: 'gentle' | 'teacher' | 'friendly' | 'energetic' = 'friendly'
): Promise<void> {
  return japaneseVoiceEngine.speak(text, { rate, style });
}

// Play a short sound effect using Web Audio API
export function playSound(type: 'correct' | 'incorrect' | 'xp' | 'achievement' | 'complete'): void {
  if (typeof window === 'undefined') return;
  if (!('AudioContext' in window || 'webkitAudioContext' in window)) return;
  
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const configs: Record<string, { freq: number; freq2?: number; duration: number; type: OscillatorType }> = {
      correct: { freq: 880, freq2: 1100, duration: 0.2, type: 'sine' },
      incorrect: { freq: 300, duration: 0.3, type: 'sawtooth' },
      xp: { freq: 660, freq2: 880, duration: 0.15, type: 'sine' },
      achievement: { freq: 880, freq2: 1320, duration: 0.4, type: 'sine' },
      complete: { freq: 528, freq2: 660, duration: 0.5, type: 'sine' },
    };
    
    const config = configs[type];
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);
    if (config.freq2) {
      oscillator.frequency.linearRampToValueAtTime(config.freq2, ctx.currentTime + config.duration * 0.5);
    }
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);
  } catch (err) {
    // Suppress audio context autoplay policy errors
  }
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function getGreeting(): { japanese: string; english: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { japanese: 'おはようございます！', english: 'Good morning!' };
  if (hour < 17) return { japanese: 'こんにちは！', english: 'Good afternoon!' };
  return { japanese: 'こんばんは！', english: 'Good evening!' };
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateOptions<T>(correct: T, pool: T[], count: number = 4): T[] {
  const wrong = pool.filter(item => item !== correct);
  const selected = shuffle(wrong).slice(0, count - 1);
  return shuffle([correct, ...selected]);
}

export function isToday(dateStr: string): boolean {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

export function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
