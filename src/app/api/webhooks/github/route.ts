import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GitHub webhook: auto-update tasks based on commit messages.
    Configure in GitHub repo settings: https://github.com/OWNER/REPO/settings/hooks
    Webhook URL: https://yourdomain.com/api/webhooks/github
    Events: Pushes
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Only process push events
    if (payload.action && payload.action !== "push" && !payload.ref) {
      return NextResponse.json({ ok: true });
    }

    const commits = payload.commits || [];
    if (!commits.length) return NextResponse.json({ ok: true });

    // Parse each commit for task keys and keywords
    for (const commit of commits) {
      const message = (commit.message || "").trim();

      // Find task keys (e.g., BANK-152, PORT-45)
      const keyMatches = message.match(/([A-Z]+-\d+)/g);
      if (!keyMatches) continue;

      const uniqueKeys = [...new Set(keyMatches)] as string[];

      for (const key of uniqueKeys) {
        const task = await db.workItem.findFirst({
          where: { key },
          include: { project: { include: { workspace: true } }, assignee: true },
        });

        if (!task) continue;

        let newStatus: string | undefined;

        // Keyword detection (case-insensitive)
        const lowerMessage = message.toLowerCase();
        if (
          lowerMessage.includes("fixes ") ||
          lowerMessage.includes("closes ") ||
          lowerMessage.includes("resolves ")
        ) {
          newStatus = "done";
        } else if (
          lowerMessage.includes("wip:") ||
          lowerMessage.includes("wip ")
        ) {
          newStatus = "in_progress";
        }

        // Update the task if a status change is detected
        if (newStatus && newStatus !== task.status) {
          await db.workItem.update({
            where: { id: task.id },
            data: { status: newStatus },
          });

          // Log the automation
          await db.activityLog.create({
            data: {
              orgId: task.project.workspace.orgId,
              who: "GitHub",
              what: `${commit.author.name} ${newStatus === "done" ? "completed" : "started"} ${task.key} via commit "${message.substring(0, 50)}"`,
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
