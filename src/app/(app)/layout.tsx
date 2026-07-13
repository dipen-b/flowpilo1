import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell";
import { getSessionUser } from "@/lib/auth";
import { getActiveSprint } from "@/lib/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const context = await getSessionUser();
  if (!context) redirect("/login");

  const activeSprint = await getActiveSprint(context.orgId);
  const sprint = activeSprint
    ? {
        name: activeSprint.name,
        progress: activeSprint.progress,
        daysLeft: activeSprint.endDate
          ? Math.max(0, Math.ceil((new Date(activeSprint.endDate).getTime() - Date.now()) / 86400000))
          : null,
      }
    : null;

  return (
    <AppShell
      user={{ id: context.user.id, name: context.user.name, initials: context.user.initials, color: context.user.color }}
      sprint={sprint}
    >
      {children}
    </AppShell>
  );
}
