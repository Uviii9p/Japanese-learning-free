'use client';

import { ReactNode } from 'react';

/**
 * StoreProvider is kept as a thin wrapper so the (app) layout can import it.
 * The real hydration guard lives in page.tsx via useHydrated().
 * We no longer gate the entire app behind a mounted flag, which was causing
 * the "stuck at loading screen" bug.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
