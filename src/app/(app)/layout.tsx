import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell";
import { getSessionUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <AppShell user={{ id: user.id, name: user.name, initials: user.initials, color: user.color }}>
      {children}
    </AppShell>
  );
}
