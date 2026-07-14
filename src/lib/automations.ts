import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

export const TRIGGERS: Record<string, string> = {
  task_created: "A task is created",
  task_urgent: "A task is marked Urgent",
  task_done: "A task is moved to Done",
};

export const ACTIONS: Record<string, string> = {
  notify_admins: "Notify admins & owner",
  notify_assignee: "Notify the assignee",
  log_activity: "Record in the activity log",
};

export interface AutomationContext {
  taskId: string;
  taskKey: string;
  taskTitle: string;
  assigneeId: string | null;
  projectId: string;
  actorName: string;
}

/** Run all enabled org rules for a trigger. Failures never break the calling request. */
export async function runAutomations(orgId: string, trigger: string, ctx: AutomationContext) {
  try {
    const rules = await db.automationRule.findMany({
      where: { orgId, trigger, enabled: true },
    });
    if (rules.length === 0) return;

    const triggerLabel = TRIGGERS[trigger] ?? trigger;

    for (const rule of rules) {
      switch (rule.action) {
        case "notify_admins": {
          const admins = await db.user.findMany({
            where: { orgId, role: { in: ["owner", "admin"] } },
            select: { id: true },
          });
          await Promise.all(
            admins.map((a) =>
              createNotification(
                a.id,
                "info",
                `Automation: ${triggerLabel}`,
                `${ctx.taskKey} — ${ctx.taskTitle}`,
                `/projects/${ctx.projectId}`
              )
            )
          );
          break;
        }
        case "notify_assignee": {
          if (ctx.assigneeId) {
            await createNotification(
              ctx.assigneeId,
              "info",
              `Automation: ${triggerLabel}`,
              `${ctx.taskKey} — ${ctx.taskTitle}`,
              `/projects/${ctx.projectId}`
            );
          }
          break;
        }
        case "log_activity": {
          await db.activityLog.create({
            data: {
              orgId,
              who: "Automation",
              what: `${triggerLabel}: ${ctx.taskKey} ${ctx.taskTitle} (by ${ctx.actorName})`,
            },
          });
          break;
        }
      }
      await db.automationRule.update({
        where: { id: rule.id },
        data: { runs: { increment: 1 } },
      });
    }
  } catch (error) {
    console.error("Automation run failed:", error);
  }
}
