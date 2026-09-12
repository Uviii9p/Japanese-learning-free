import { AppShell } from '@/components/shell/AppShell';
import { StoreProvider } from '@/components/StoreProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  );
}
