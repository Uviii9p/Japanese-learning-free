export interface AudioProviderOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  gender?: 'female' | 'male';
  voiceStyle?: 'gentle' | 'teacher' | 'friendly' | 'energetic';
}

export interface AudioProvider {
  name: string;
  speak(text: string, options?: AudioProviderOptions): Promise<void>;
  stop(): void;
  isAvailable(): boolean;
}

class MemoryAudioCache {
  private cache: Map<string, HTMLAudioElement> = new Map();

  public get(key: string): HTMLAudioElement | undefined {
    return this.cache.get(key);
  }

  public set(key: string, audio: HTMLAudioElement): void {
    this.cache.set(key, audio);
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const audioCache = new MemoryAudioCache();
