import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell";
import { getSessionUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const context = await getSessionUser();
  if (!context) redirect("/login");

  return (
    <AppShell user={{ id: context.user.id, name: context.user.name, initials: context.user.initials, color: context.user.color }}>
      {children}
    </AppShell>
  );
}
