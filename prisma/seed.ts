import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const db = new PrismaClient({ adapter });

const DEMO_PASSWORD = "flowpilot123";

async function main() {
  // Clean slate (order matters for FK constraints)
  await db.activityLog.deleteMany();
  await db.aiInsight.deleteMany();
  await db.comment.deleteMany();
  await db.workItem.deleteMany();
  await db.sprint.deleteMany();
  await db.project.deleteMany();
  await db.membership.deleteMany();
  await db.user.deleteMany();
  await db.workspace.deleteMany();
  await db.organization.deleteMany();

  const org = await db.organization.create({
    data: { name: "Vasundhara Infotech", plan: "pro" },
  });
  const workspace = await db.workspace.create({
    data: { name: "Product Engineering", orgId: org.id },
  });

  const memberSeed = [
    { id: "u1", name: "Aarav Shah", initials: "AS", role: "owner", color: "#2a78d6", capacity: 40 },
    { id: "u2", name: "Priya Mehta", initials: "PM", role: "admin", color: "#1baf7a", capacity: 40 },
    { id: "u3", name: "Rohan Patel", initials: "RP", role: "member", color: "#4a3aa7", capacity: 40 },
    { id: "u4", name: "Sara Iyer", initials: "SI", role: "member", color: "#eda100", capacity: 40 },
    { id: "u5", name: "Dev Kapoor", initials: "DK", role: "member", color: "#e34948", capacity: 40 },
    { id: "u6", name: "Nisha Rao", initials: "NR", role: "guest", color: "#2a78d6", capacity: 32 },
  ];
  const users: Record<string, string> = {};
  for (const m of memberSeed) {
    const u = await db.user.create({
      data: {
        name: m.name, initials: m.initials, role: m.role, color: m.color,
        capacity: m.capacity, email: `${m.name.split(" ")[0].toLowerCase()}@vasundhara.dev`,
        passwordHash: hashPassword(DEMO_PASSWORD),
        orgId: org.id,
      },
    });
    users[m.id] = u.id;
    await db.membership.create({ data: { userId: u.id, orgId: org.id, role: m.role } });
  }

  const projectSeed = [
    { id: "p1", name: "Mobile Banking App", key: "BANK", emoji: "🏦", health: 84, risk: "good", progress: 68, dueDate: "Aug 22", lead: "u1", forecastDate: "Aug 25", forecastConfidence: 87, forecastDelta: "+3 days", summary: "On track. Payments module ahead of schedule; KYC flow needs review capacity." },
    { id: "p2", name: "Customer Portal 2.0", key: "PORT", emoji: "🧭", health: 58, risk: "warning", progress: 41, dueDate: "Jul 31", lead: "u2", forecastDate: "Aug 08", forecastConfidence: 62, forecastDelta: "+8 days", summary: "At risk. Design review backlog is blocking 5 frontend tasks; velocity down 18%." },
    { id: "p3", name: "Data Platform Migration", key: "DATA", emoji: "🗄️", health: 31, risk: "critical", progress: 22, dueDate: "Jul 18", lead: "u3", forecastDate: "Aug 04", forecastConfidence: 41, forecastDelta: "+17 days", summary: "Critical. Rohan is over capacity and 3 blockers are unresolved for 6+ days." },
    { id: "p4", name: "Support Chatbot", key: "CHAT", emoji: "🤖", health: 91, risk: "good", progress: 83, dueDate: "Jul 25", lead: "u4", forecastDate: "Jul 24", forecastConfidence: 94, forecastDelta: "1 day early", summary: "Ahead of plan. Intent coverage at 96%; release candidate ready Friday." },
  ];
  const projects: Record<string, string> = {};
  for (const p of projectSeed) {
    const proj = await db.project.create({
      data: {
        name: p.name, key: p.key, emoji: p.emoji, health: p.health, risk: p.risk,
        progress: p.progress, dueDate: p.dueDate, summary: p.summary,
        forecastDate: p.forecastDate, forecastConfidence: p.forecastConfidence, forecastDelta: p.forecastDelta,
        workspaceId: workspace.id, leadId: users[p.lead],
      },
    });
    projects[p.id] = proj.id;
  }

  const sprint = await db.sprint.create({
    data: { name: "Sprint 14", goal: "Ship KYC flow + close Portal design debt", status: "active", startDate: "Jul 7", endDate: "Jul 18", projectId: projects.p1 },
  });

  const taskSeed = [
    { key: "BANK-142", title: "Implement biometric login (Face ID / fingerprint)", project: "p1", assignee: "u6", priority: "urgent", status: "in_progress", labels: "auth,mobile", due: "Jul 12", estimate: 12, spent: 9, sprint: true },
    { key: "BANK-138", title: "Transaction history infinite scroll + filters", project: "p1", assignee: "u4", priority: "high", status: "in_review", labels: "frontend", due: "Jul 11", estimate: 8, spent: 8, aiFlag: "PR #482 merged", sprint: true },
    { key: "BANK-151", title: "KYC document upload with OCR validation", project: "p1", assignee: "u3", priority: "high", status: "todo", labels: "backend,compliance", due: "Jul 16", estimate: 16, spent: 0, aiFlag: "Blocked by BANK-149", sprint: true },
    { key: "PORT-88", title: "Rebuild billing settings page in new design system", project: "p2", assignee: "u4", priority: "medium", status: "in_progress", labels: "frontend,billing", due: "Jul 14", estimate: 10, spent: 6 },
    { key: "PORT-91", title: "Design review: notification preferences UX", project: "p2", assignee: "u2", priority: "urgent", status: "todo", labels: "design", due: "Jul 10", estimate: 4, spent: 0, aiFlag: "Overdue · blocks 5 tasks" },
    { key: "DATA-45", title: "Migrate events pipeline to new warehouse schema", project: "p3", assignee: "u3", priority: "urgent", status: "in_progress", labels: "data,infra", due: "Jul 09", estimate: 24, spent: 31, aiFlag: "Over estimate · overdue" },
    { key: "CHAT-29", title: "Fine-tune fallback responses for billing intents", project: "p4", assignee: "u5", priority: "medium", status: "in_review", labels: "chat", due: "Jul 15", estimate: 6, spent: 5 },
    { key: "BANK-135", title: "Rate limiting on transfers API", project: "p1", assignee: "u1", priority: "high", status: "done", labels: "backend,security", due: "Jul 08", estimate: 8, spent: 7, sprint: true },
    { key: "PORT-85", title: "SSO login with Microsoft Entra", project: "p2", assignee: "u5", priority: "high", status: "backlog", labels: "auth", due: "Jul 21", estimate: 12, spent: 0 },
    { key: "CHAT-31", title: "Human handoff flow when confidence < 70%", project: "p4", assignee: "u6", priority: "high", status: "todo", labels: "ux", due: "Jul 17", estimate: 8, spent: 0 },
    { key: "DATA-48", title: "Backfill 2024 events with dedup pass", project: "p3", assignee: "u1", priority: "medium", status: "backlog", labels: "data", due: "Jul 24", estimate: 14, spent: 0 },
    { key: "BANK-144", title: "Push notification service for payment alerts", project: "p1", assignee: "u3", priority: "medium", status: "in_progress", labels: "backend,mobile", due: "Jul 15", estimate: 10, spent: 4, sprint: true },
  ];
  for (const t of taskSeed) {
    await db.workItem.create({
      data: {
        key: t.key, title: t.title, type: "task", status: t.status, priority: t.priority,
        labels: t.labels, estimate: t.estimate, spent: t.spent, dueDate: t.due, aiFlag: t.aiFlag ?? null,
        projectId: projects[t.project], assigneeId: users[t.assignee],
        sprintId: t.sprint ? sprint.id : null,
      },
    });
  }

  // Rule-based alerts derived from deadlines and capacity (no AI).
  await db.aiInsight.createMany({
    data: [
      { level: "critical", kind: "risk", title: "Data Platform Migration is past its Jul 18 deadline", detail: "3 tasks unresolved for 6+ days. Rohan Patel is assigned 51h against a 40h capacity.", action: "Rebalance tasks", projectId: projects.p3 },
      { level: "warning", kind: "risk", title: "Design review bottleneck in Customer Portal", detail: "PORT-91 is overdue and blocks 5 downstream frontend tasks.", action: "Escalate review", projectId: projects.p2 },
      { level: "warning", kind: "risk", title: "Rohan Patel is over capacity", detail: "51h assigned vs 40h capacity, 3 weeks running.", action: "Reduce load by 11h", projectId: projects.p3 },
    ],
  });

  await db.activityLog.createMany({
    data: [
      { who: "Sara Iyer", what: "merged PR #482 for BANK-138" },
      { who: "Aarav Shah", what: "moved BANK-135 to Done" },
      { who: "Priya Mehta", what: "commented on PORT-88: “Use the new tokens for spacing”" },
      { who: "Dev Kapoor", what: "logged 3h on CHAT-29" },
      { who: "Nisha Rao", what: "closed Sprint 13 with a retrospective" },
      { who: "Nisha Rao", what: "created BANK-152 from voice note" },
    ],
  });

  console.log(`Seeded org "${org.name}" with ${projectSeed.length} projects, ${taskSeed.length} work items, ${memberSeed.length} users.`);
  console.log(`Demo logins: <firstname>@vasundhara.dev / ${DEMO_PASSWORD} (e.g. aarav@vasundhara.dev)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
