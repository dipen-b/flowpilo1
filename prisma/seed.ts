import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Clean DB
  await db.workItem.deleteMany({});
  await db.project.deleteMany({});
  await db.workspace.deleteMany({});
  await db.membership.deleteMany({});
  await db.user.deleteMany({});
  await db.organization.deleteMany({});

  const org = await db.organization.create({
    data: {
      name: "Finlay Product",
    },
  });

  const workspace = await db.workspace.create({
    data: {
      name: "Product Workspace",
      orgId: org.id,
    },
  });

  const ownerSeed = { id: "owner", email: "owner@finlay.com", name: "Nisha Rao", role: "owner" };

  const owner = await db.user.create({
    data: {
      id: ownerSeed.id,
      email: ownerSeed.email,
      name: ownerSeed.name,
      role: ownerSeed.role,
      initials: "NR",
      color: "#ec4899",
      orgId: org.id,
    },
  });

  // Members
  const memberSeed = [
    { id: "member1", email: "sara@finlay.com", name: "Sara Iyer", role: "member", initials: "SI", color: "#f59e0b" },
    { id: "member2", email: "aarav@finlay.com", name: "Aarav Shah", role: "member", initials: "AS", color: "#3b82f6" },
    { id: "member3", email: "priya@finlay.com", name: "Priya Mehta", role: "member", initials: "PM", color: "#8b5cf6" },
    { id: "member4", email: "dev@finlay.com", name: "Dev Kapoor", role: "admin", initials: "DK", color: "#06b6d4" },
    { id: "member5", email: "rohan@finlay.com", name: "Rohan Patel", role: "member", initials: "RP", color: "#10b981" },
  ];

  for (const m of memberSeed) {
    await db.user.create({
      data: {
        id: m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        initials: m.initials,
        color: m.color,
        orgId: org.id,
      },
    });
    await db.membership.create({
      data: { userId: m.id, orgId: org.id, role: m.role },
    });
  }

  await db.membership.create({
    data: { userId: owner.id, orgId: org.id, role: "owner" },
  });

  // Projects
  const projectSeed = [
    { key: "BANK", emoji: "🏦", name: "Banking Platform", lead: "member1" },
    { key: "PORT", emoji: "🚪", name: "Customer Portal", lead: "member4" },
    { key: "DATA", emoji: "📊", name: "Data Platform", lead: "member5" },
    { key: "CHAT", emoji: "💬", name: "Internal Chat", lead: "member2" },
  ];

  const projects: Record<string, string> = {};

  for (let i = 0; i < projectSeed.length; i++) {
    const p = projectSeed[i];
    const proj = await db.project.create({
      data: {
        key: p.key,
        emoji: p.emoji,
        name: p.name,
        workspaceId: workspace.id,
        leadId: p.lead,
      },
    });
    projects[`p${i + 1}`] = proj.id;
  }

  // Work items
  const taskSeed = [
    { key: "BANK-135", projectId: "p1", title: "Biometric login", status: "Done" },
    { key: "BANK-138", projectId: "p1", title: "Session timeout after 5min of inactivity", status: "In Progress" },
    { key: "BANK-152", projectId: "p1", title: "Fix transaction filter by date range", status: "Backlog" },
    { key: "BANK-138", projectId: "p1", title: "Add transaction export to CSV", status: "Backlog" },
    { key: "PORT-81", projectId: "p2", title: "Redesign home page hero", status: "In Progress" },
    { key: "PORT-88", projectId: "p2", title: "Button color contrast WCAG AA", status: "In Review" },
    { key: "PORT-91", projectId: "p2", title: "Design system token library", status: "Blocked" },
    { key: "DATA-45", projectId: "p3", title: "Kafka consumer scaling", status: "In Progress" },
    { key: "DATA-47", projectId: "p3", title: "Pipeline error retry logic", status: "In Progress" },
    { key: "CHAT-29", projectId: "p4", title: "Implement message threading", status: "In Progress" },
    { key: "CHAT-31", projectId: "p4", title: "Dark mode", status: "Backlog" },
  ];

  for (const t of taskSeed) {
    await db.workItem.create({
      data: {
        key: t.key,
        title: t.title,
        projectId: projects[t.projectId],
        status: t.status,
        type: "task",
      },
    });
  }

  // AI Insights (Rule-based alerts derived from deadlines and capacity, no AI).
  await db.aiInsight.createMany({
    data: [
      { level: "critical", kind: "risk", title: "Data Platform Migration is past its Jul 18 deadline", detail: "3 tasks unresolved for 6+ days. Rohan Patel is assigned 51h against a 40h capacity.", action: "Rebalance tasks", projectId: projects.p3 },
      { level: "warning", kind: "risk", title: "Design review bottleneck in Customer Portal", detail: "PORT-91 is overdue and blocks 5 downstream frontend tasks.", action: "Escalate review", projectId: projects.p2 },
      { level: "warning", kind: "risk", title: "Rohan Patel is over capacity", detail: "51h assigned vs 40h capacity, 3 weeks running.", action: "Reduce load by 11h", projectId: projects.p3 },
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

  console.log(`Seeded org "${org.name}" with ${projectSeed.length} projects, ${taskSeed.length} work items, ${memberSeed.length} users.`);
}

main();
