import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

const DEMO_PASSWORD = "flowpilot123";

async function main() {
  // Clean DB (FK-safe order; user/org deletes cascade sessions, attendance, time entries, etc.)
  await db.invite.deleteMany({}); // invites restrict user deletes via createdBy
  await db.comment.deleteMany({});
  await db.workItem.deleteMany({});
  await db.sprint.deleteMany({});
  await db.aiInsight.deleteMany({});
  await db.project.deleteMany({});
  await db.workspace.deleteMany({});
  await db.membership.deleteMany({});
  await db.user.deleteMany({});
  await db.organization.deleteMany({});

  const org = await db.organization.create({
    data: { name: "Vasundhara Infotech" },
  });

  const workspace = await db.workspace.create({
    data: { name: "Product Workspace", orgId: org.id },
  });

  const passwordHash = hashPassword(DEMO_PASSWORD);

  // Every seeded user can log in with flowpilot123. The login page advertises aarav@vasundhara.dev.
  const userSeed = [
    { id: "owner", email: "nisha@vasundhara.dev", name: "Nisha Rao", role: "owner", initials: "NR", color: "#ec4899" },
    { id: "member2", email: "aarav@vasundhara.dev", name: "Aarav Shah", role: "admin", initials: "AS", color: "#3b82f6" },
    { id: "member1", email: "sara@vasundhara.dev", name: "Sara Iyer", role: "member", initials: "SI", color: "#f59e0b" },
    { id: "member3", email: "priya@vasundhara.dev", name: "Priya Mehta", role: "member", initials: "PM", color: "#8b5cf6" },
    { id: "member4", email: "dev@vasundhara.dev", name: "Dev Kapoor", role: "member", initials: "DK", color: "#06b6d4" },
    { id: "member5", email: "rohan@vasundhara.dev", name: "Rohan Patel", role: "member", initials: "RP", color: "#10b981" },
  ];

  for (const u of userSeed) {
    await db.user.create({
      data: {
        id: u.id, email: u.email, name: u.name, role: u.role,
        initials: u.initials, color: u.color, orgId: org.id, passwordHash,
      },
    });
    await db.membership.create({ data: { userId: u.id, orgId: org.id, role: u.role } });
  }

  // Projects
  const projectSeed = [
    { key: "BANK", emoji: "🏦", name: "Banking Platform", lead: "member1", health: 82, risk: "good", progress: 64 },
    { key: "PORT", emoji: "🚪", name: "Customer Portal", lead: "member4", health: 68, risk: "warning", progress: 41 },
    { key: "DATA", emoji: "📊", name: "Data Platform", lead: "member5", health: 44, risk: "serious", progress: 55 },
    { key: "CHAT", emoji: "💬", name: "Internal Chat", lead: "member2", health: 90, risk: "good", progress: 78 },
  ];

  const projects: Record<string, string> = {};
  for (let i = 0; i < projectSeed.length; i++) {
    const p = projectSeed[i];
    const proj = await db.project.create({
      data: {
        key: p.key, emoji: p.emoji, name: p.name, workspaceId: workspace.id,
        leadId: p.lead, health: p.health, risk: p.risk, progress: p.progress,
      },
    });
    projects[`p${i + 1}`] = proj.id;
  }

  // Active sprint (matches the "Sprint 14" widget in the sidebar)
  const sprint = await db.sprint.create({
    data: {
      name: "Sprint 14", goal: "Ship biometric login + portal redesign", status: "active",
      projectId: projects.p1,
    },
  });

  // Work items — statuses must match schema values: backlog | todo | in_progress | in_review | done
  const taskSeed = [
    { key: "BANK-135", projectId: "p1", title: "Biometric login", status: "done", assignee: "member2", estimate: 8, spent: 9, sprint: true },
    { key: "BANK-138", projectId: "p1", title: "Session timeout after 5min of inactivity", status: "in_progress", assignee: "member1", estimate: 5, spent: 3, sprint: true },
    { key: "BANK-152", projectId: "p1", title: "Fix transaction filter by date range", status: "todo", assignee: "member1", estimate: 3, spent: 0, sprint: true },
    { key: "BANK-154", projectId: "p1", title: "Add transaction export to CSV", status: "backlog", assignee: null, estimate: 5, spent: 0 },
    { key: "PORT-81", projectId: "p2", title: "Redesign home page hero", status: "in_progress", assignee: "member3", estimate: 8, spent: 6 },
    { key: "PORT-88", projectId: "p2", title: "Button color contrast WCAG AA", status: "in_review", assignee: "member3", estimate: 2, spent: 2 },
    { key: "PORT-91", projectId: "p2", title: "Design system token library", status: "in_progress", assignee: "member4", estimate: 13, spent: 10 },
    { key: "DATA-45", projectId: "p3", title: "Kafka consumer scaling", status: "in_progress", assignee: "member5", estimate: 13, spent: 11 },
    { key: "DATA-47", projectId: "p3", title: "Pipeline error retry logic", status: "in_progress", assignee: "member5", estimate: 8, spent: 4 },
    { key: "DATA-51", projectId: "p3", title: "Backfill job for Q2 events", status: "todo", assignee: "member5", estimate: 8, spent: 0 },
    { key: "CHAT-29", projectId: "p4", title: "Implement message threading", status: "in_progress", assignee: "member2", estimate: 8, spent: 5 },
    { key: "CHAT-31", projectId: "p4", title: "Dark mode", status: "backlog", assignee: null, estimate: 5, spent: 0 },
  ];

  for (const t of taskSeed) {
    await db.workItem.create({
      data: {
        key: t.key, title: t.title, projectId: projects[t.projectId], status: t.status,
        type: "task", assigneeId: t.assignee, estimate: t.estimate, spent: t.spent,
        sprintId: "sprint" in t && t.sprint ? sprint.id : null,
      },
    });
  }

  // Attendance — populate the current month (weekdays up to today) for every member.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const today = now.getDate();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  // Deterministic per-user "story": index into pattern by day
  const patterns: Record<string, string[]> = {
    owner: ["present", "present", "present", "present", "present"],
    member1: ["present", "present", "late", "present", "present"],
    member2: ["present", "present", "present", "half-day", "present"],
    member3: ["present", "leave", "present", "present", "present"],
    member4: ["present", "present", "present", "present", "absent"],
    member5: ["late", "present", "present", "present", "present"],
  };

  let attendanceCount = 0;
  for (const u of userSeed) {
    const pattern = patterns[u.id];
    let workday = 0;
    for (let day = 1; day < today; day++) {
      const d = new Date(year, month, day);
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue; // skip weekends
      const status = pattern[workday % pattern.length];
      workday++;

      const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;
      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let workHours = 0;

      if (status === "present" || status === "late" || status === "half-day") {
        const startHour = status === "late" ? 10 : 9;
        const endHour = status === "half-day" ? 13 : 18;
        checkIn = new Date(year, month, day, startHour, (day * 7) % 30);
        checkOut = new Date(year, month, day, endHour, (day * 11) % 30);
        workHours = Math.floor((checkOut.getTime() - checkIn.getTime()) / 60000) - 45; // minus lunch break
      }

      await db.attendance.create({
        data: {
          userId: u.id, date: dateStr, status,
          checkInTime: checkIn, checkOutTime: checkOut, workHours,
          notes: status === "leave" ? "Planned leave" : "",
        },
      });
      attendanceCount++;
    }
  }

  // Alerts derived from deadlines and capacity
  await db.aiInsight.createMany({
    data: [
      { level: "critical", kind: "risk", title: "Data Platform Migration is past its deadline", detail: "3 tasks unresolved for 6+ days. Rohan Patel is assigned 29h against a 40h capacity.", action: "Rebalance tasks", projectId: projects.p3 },
      { level: "warning", kind: "risk", title: "Design review bottleneck in Customer Portal", detail: "PORT-91 is overdue and blocks 5 downstream frontend tasks.", action: "Escalate review", projectId: projects.p2 },
      { level: "warning", kind: "risk", title: "Rohan Patel is trending over capacity", detail: "3 concurrent in-progress tasks, 3 weeks running.", action: "Reduce load", projectId: projects.p3 },
    ],
  });

  await db.activityLog.createMany({
    data: [
      { orgId: org.id, who: "Sara Iyer", what: "merged PR #482 for BANK-138" },
      { orgId: org.id, who: "Aarav Shah", what: "moved BANK-135 to Done" },
      { orgId: org.id, who: "Priya Mehta", what: "commented on PORT-88: Use the new tokens for spacing" },
      { orgId: org.id, who: "Dev Kapoor", what: "logged 3h on CHAT-29" },
      { orgId: org.id, who: "Nisha Rao", what: "closed Sprint 13 with a retrospective" },
      { orgId: org.id, who: "Nisha Rao", what: "created BANK-152 from voice note" },
    ],
  });

  console.log(
    `Seeded org "${org.name}": ${userSeed.length} users (password: ${DEMO_PASSWORD}), ` +
    `${projectSeed.length} projects, ${taskSeed.length} work items, ${attendanceCount} attendance records.`
  );
}

main();
