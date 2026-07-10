import { db } from "@/lib/db";

/* Server-side data access. These run in Server Components and Route Handlers.
   They shape DB rows into the view models the UI already expects. */

export async function getProjects() {
  const projects = await db.project.findMany({
    include: { lead: true, workItems: { include: { assignee: true } } },
    orderBy: { createdAt: "asc" },
  });
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    key: p.key,
    emoji: p.emoji,
    health: p.health,
    risk: p.risk,
    progress: p.progress,
    dueDate: p.dueDate ?? "",
    summary: p.summary,
    lead: p.lead,
    prediction: { date: p.forecastDate ?? "", confidence: p.forecastConfidence, delta: p.forecastDelta },
    openTasks: p.workItems.filter((t) => t.status !== "done").length,
    members: dedupeMembers(p.workItems.flatMap((t) => (t.assignee ? [t.assignee] : []))),
  }));
}

export async function getProject(id: string) {
  const p = await db.project.findUnique({
    where: { id },
    include: {
      lead: true,
      workItems: { include: { assignee: true }, orderBy: { createdAt: "asc" } },
      sprints: true,
    },
  });
  if (!p) return null;
  return {
    id: p.id, name: p.name, key: p.key, emoji: p.emoji, health: p.health,
    risk: p.risk, progress: p.progress, dueDate: p.dueDate ?? "", summary: p.summary,
    sprint: p.sprints[0]?.name ?? "",
    prediction: { date: p.forecastDate ?? "", confidence: p.forecastConfidence, delta: p.forecastDelta },
    tasks: p.workItems.map(shapeTask),
  };
}

export async function getTasks() {
  const items = await db.workItem.findMany({ include: { assignee: true, project: true }, orderBy: { createdAt: "asc" } });
  return items.map(shapeTask);
}

export async function getMembers() {
  const users = await db.user.findMany({ include: { assignedItems: true }, orderBy: { createdAt: "asc" } });
  return users.map((u) => {
    const load = u.assignedItems.reduce((sum, t) => sum + (t.status !== "done" ? t.estimate : 0), 0);
    const over = load > u.capacity;
    return {
      id: u.id, name: u.name, initials: u.initials, role: u.role, color: u.color,
      capacity: u.capacity, load,
      burnoutRisk: over ? "critical" : load > u.capacity * 0.95 ? "warning" : "good",
    };
  });
}

export async function getInsights() {
  return db.aiInsight.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getActiveSprint() {
  const sprint = await db.sprint.findFirst({
    where: { status: "active" },
    include: {
      project: true,
      items: { include: { assignee: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!sprint) return null;
  const total = sprint.items.reduce((s, t) => s + t.estimate, 0);
  const done = sprint.items.filter((t) => t.status === "done").reduce((s, t) => s + t.estimate, 0);
  return {
    id: sprint.id,
    name: sprint.name,
    goal: sprint.goal,
    startDate: sprint.startDate ?? "",
    endDate: sprint.endDate ?? "",
    projectName: sprint.project.name,
    totalPoints: total,
    donePoints: done,
    progress: total ? Math.round((done / total) * 100) : 0,
    items: sprint.items.map(shapeTask),
  };
}

export async function getActivity() {
  return db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 });
}

export async function getDashboard() {
  const [projects, members, insights, activity] = await Promise.all([
    getProjects(), getMembers(), getInsights(), getActivity(),
  ]);
  const risks = insights.filter((i) => i.kind === "risk");
  const recs = insights.filter((i) => i.kind === "recommendation");
  const healthAvg = Math.round(projects.reduce((s, p) => s + p.health, 0) / (projects.length || 1));
  return { projects, members, risks, recommendations: recs, activity, healthAvg };
}

function shapeTask(t: { id: string; key: string; title: string; status: string; priority: string; labels: string; estimate: number; spent: number; dueDate: string | null; aiFlag: string | null; projectId: string; assignee: { id: string; name: string; initials: string; color: string } | null }) {
  return {
    id: t.id, key: t.key, title: t.title, status: t.status, priority: t.priority,
    labels: t.labels ? t.labels.split(",") : [],
    estimate: t.estimate, spent: t.spent, due: t.dueDate ?? "", aiFlag: t.aiFlag ?? undefined,
    project: t.projectId, assignee: t.assignee,
  };
}

function dedupeMembers<T extends { id: string }>(members: T[]): T[] {
  const seen = new Set<string>();
  return members.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
}
