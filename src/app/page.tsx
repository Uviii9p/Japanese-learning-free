'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, useHydrated } from '@/lib/store';

export default function RootPage() {
  const router = useRouter();
  const onboardingComplete = useAppStore(s => s.onboardingComplete);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    const target = onboardingComplete ? '/dashboard' : '/onboarding';
    const timer = setTimeout(() => {
      try {
        router.replace(target);
      } catch {
        window.location.replace(target);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [hydrated, onboardingComplete, router]);

  // Show a minimal splash while hydration completes (typically < 50 ms)
  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0d0d',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e63155 0%, #ff6b8a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2rem',
        }}>
          🇯🇵
        </div>
        <div style={{
          fontFamily: 'Noto Sans JP, sans-serif',
          fontSize: '1.25rem',
          color: '#e63155',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}>
          日本語マスタリー
        </div>
        <div style={{
          marginTop: '1.25rem',
          display: 'flex',
          gap: '0.4rem',
          justifyContent: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#e63155',
                opacity: 0.4,
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
