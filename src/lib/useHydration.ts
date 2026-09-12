'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use this to prevent Zustand persisted-store hydration mismatches with Next.js SSR.
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
