'use client';

import { useEffect, useState, ReactNode } from 'react';

/**
 * StoreProvider prevents Zustand persist store from causing SSR/client hydration mismatches.
 * 
 * Strategy: Use `dynamic(() => ..., { ssr: false })` approach by rendering 
 * a loading state on server AND initial client render, then swapping to real content 
 * after mount. The key insight is that both server and client must render the SAME 
 * placeholder HTML on first render.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // This exact same HTML is rendered on BOTH server and client initial render
    // so there is no hydration mismatch
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0d0d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f9fafb',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🇯🇵</div>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#e63155',
            letterSpacing: '0.05em'
          }}>
            日本語マスタリー
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
