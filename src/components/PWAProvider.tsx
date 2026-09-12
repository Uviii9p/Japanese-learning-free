'use client';

import { useEffect, useRef } from 'react';

/**
 * PWAProvider — runs on every app mount.
 * 1. Registers the service worker (enables Chrome "Install" prompt).
 * 2. On first open (or each fresh page load), speaks the Japanese greeting
 *    "こんにちは！お元気ですか？" (Hello! How are you?) with a minimum
 *    7-second speech duration using the Web Speech API.
 */
export function PWAProvider() {
  const spokenRef = useRef(false);

  useEffect(() => {
    // --- 1. Register Service Worker ---
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[PWA] Service worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] SW registration failed:', err);
        });
    }

    // --- 2. Japanese Greeting Speech on open ---
    if (spokenRef.current) return;
    spokenRef.current = true;

    // The full greeting spoken slowly to fill ≥7 seconds
    const greetingLines = [
      { text: 'こんにちは！', lang: 'ja-JP', rate: 0.7, pitch: 1.05 },
      { text: 'お元気ですか？', lang: 'ja-JP', rate: 0.65, pitch: 1.0 },
      { text: 'ようこそ！日本語マスタリーへ。', lang: 'ja-JP', rate: 0.65, pitch: 1.0 },
      { text: '今日も一緒に日本語を勉強しましょう！', lang: 'ja-JP', rate: 0.65, pitch: 1.0 },
    ];

    const speak = () => {
      if (!window.speechSynthesis) return;

      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const speakLine = (index: number) => {
        if (index >= greetingLines.length) return;

        const line = greetingLines[index];
        const utterance = new SpeechSynthesisUtterance(line.text);
        utterance.lang = line.lang;
        utterance.rate = line.rate;
        utterance.pitch = line.pitch;
        utterance.volume = 1;

        // Pick the best available Japanese voice
        const voices = window.speechSynthesis.getVoices();
        const jpVoice =
          voices.find((v) => v.lang === 'ja-JP' && v.localService) ||
          voices.find((v) => v.lang === 'ja-JP') ||
          voices.find((v) => v.lang.startsWith('ja')) ||
          null;
        if (jpVoice) utterance.voice = jpVoice;

        // Chain to next line when this one ends
        utterance.onend = () => speakLine(index + 1);

        window.speechSynthesis.speak(utterance);
      };

      // Voices may not be loaded immediately — wait for them
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        speakLine(0);
      } else {
        window.speechSynthesis.onvoiceschanged = () => speakLine(0);
      }
    };

    // Small delay so the browser has a chance to load voices and the page settles
    const timer = setTimeout(speak, 800);
    return () => clearTimeout(timer);
  }, []);

  return null; // This component renders nothing
}
