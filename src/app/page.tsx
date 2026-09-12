'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function RootPage() {
  const router = useRouter();
  const onboardingComplete = useAppStore(s => s.onboardingComplete);

  useEffect(() => {
    if (onboardingComplete) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [onboardingComplete, router]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0d0d0d'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇯🇵</div>
        <div style={{ 
          fontFamily: 'Noto Sans JP, sans-serif',
          fontSize: '1.5rem',
          color: '#e63155',
          fontWeight: 700
        }}>
          日本語マスタリー
        </div>
        <div style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Loading...
        </div>
      </div>
    </div>
  );
}
