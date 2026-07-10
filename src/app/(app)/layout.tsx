import { AppShell } from "@/components/shell";
import { Copilot } from "@/components/copilot";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
      <Copilot />
    </AppShell>
  );
}
