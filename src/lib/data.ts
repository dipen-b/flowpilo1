export type Priority = "urgent" | "high" | "medium" | "low";
export type Status = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type RiskLevel = "critical" | "serious" | "warning" | "good";

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  capacity: number; // hours/week
  load: number; // assigned hours this week
  productivity: number; // 0-100
  burnoutRisk: RiskLevel;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  project: string;
  assignee: string;
  priority: Priority;
  status: Status;
  labels: string[];
  due: string;
  estimate: number;
  spent: number;
  aiFlag?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  emoji: string;
  health: number; // 0-100
  risk: RiskLevel;
  progress: number;
  dueDate: string;
  lead: string;
  members: string[];
  sprint: string;
  prediction: { date: string; confidence: number; delta: string };
  summary: string;
}

export const members: Member[] = [
  { id: "u1", name: "Aarav Shah", initials: "AS", role: "Engineering Lead", color: "var(--series-1)", capacity: 40, load: 34, productivity: 92, burnoutRisk: "good" },
  { id: "u2", name: "Priya Mehta", initials: "PM", role: "Product Designer", color: "var(--series-2)", capacity: 40, load: 44, productivity: 88, burnoutRisk: "warning" },
  { id: "u3", name: "Rohan Patel", initials: "RP", role: "Backend Engineer", color: "var(--series-4)", capacity: 40, load: 51, productivity: 74, burnoutRisk: "critical" },
  { id: "u4", name: "Sara Iyer", initials: "SI", role: "Frontend Engineer", color: "var(--series-3)", capacity: 40, load: 28, productivity: 95, burnoutRisk: "good" },
  { id: "u5", name: "Dev Kapoor", initials: "DK", role: "QA Engineer", color: "var(--series-5)", capacity: 40, load: 37, productivity: 81, burnoutRisk: "good" },
  { id: "u6", name: "Nisha Rao", initials: "NR", role: "Mobile Engineer", color: "var(--series-1)", capacity: 32, load: 30, productivity: 86, burnoutRisk: "good" },
];

export const projects: Project[] = [
  {
    id: "p1", name: "Mobile Banking App", key: "BANK", emoji: "🏦", health: 84, risk: "good",
    progress: 68, dueDate: "Aug 22", lead: "u1", members: ["u1", "u3", "u4", "u6"], sprint: "Sprint 14",
    prediction: { date: "Aug 25", confidence: 87, delta: "+3 days" },
    summary: "On track. Payments module ahead of schedule; KYC flow needs review capacity.",
  },
  {
    id: "p2", name: "Customer Portal 2.0", key: "PORT", emoji: "🧭", health: 58, risk: "warning",
    progress: 41, dueDate: "Jul 31", lead: "u2", members: ["u2", "u4", "u5"], sprint: "Sprint 9",
    prediction: { date: "Aug 08", confidence: 62, delta: "+8 days" },
    summary: "At risk. Design review backlog is blocking 5 frontend tasks; velocity down 18%.",
  },
  {
    id: "p3", name: "Data Platform Migration", key: "DATA", emoji: "🗄️", health: 31, risk: "critical",
    progress: 22, dueDate: "Jul 18", lead: "u3", members: ["u1", "u3"], sprint: "Sprint 6",
    prediction: { date: "Aug 04", confidence: 41, delta: "+17 days" },
    summary: "Critical. Rohan is over capacity and 3 blockers are unresolved for 6+ days.",
  },
  {
    id: "p4", name: "Support Chatbot", key: "CHAT", emoji: "🤖", health: 91, risk: "good",
    progress: 83, dueDate: "Jul 25", lead: "u4", members: ["u4", "u5", "u6"], sprint: "Sprint 4",
    prediction: { date: "Jul 24", confidence: 94, delta: "1 day early" },
    summary: "Ahead of plan. Intent coverage at 96%; release candidate ready Friday.",
  },
];

export const tasks: Task[] = [
  { id: "t1", key: "BANK-142", title: "Implement biometric login (Face ID / fingerprint)", project: "p1", assignee: "u6", priority: "urgent", status: "in_progress", labels: ["auth", "mobile"], due: "Jul 12", estimate: 12, spent: 9 },
  { id: "t2", key: "BANK-138", title: "Transaction history infinite scroll + filters", project: "p1", assignee: "u4", priority: "high", status: "in_review", labels: ["frontend"], due: "Jul 11", estimate: 8, spent: 8, aiFlag: "PR #482 merged" },
  { id: "t3", key: "BANK-151", title: "KYC document upload with OCR validation", project: "p1", assignee: "u3", priority: "high", status: "todo", labels: ["backend", "compliance"], due: "Jul 16", estimate: 16, spent: 0, aiFlag: "Blocked by BANK-149" },
  { id: "t4", key: "PORT-88", title: "Rebuild billing settings page in new design system", project: "p2", assignee: "u4", priority: "medium", status: "in_progress", labels: ["frontend", "billing"], due: "Jul 14", estimate: 10, spent: 6 },
  { id: "t5", key: "PORT-91", title: "Design review: notification preferences UX", project: "p2", assignee: "u2", priority: "urgent", status: "todo", labels: ["design"], due: "Jul 10", estimate: 4, spent: 0, aiFlag: "Overdue · blocks 5 tasks" },
  { id: "t6", key: "DATA-45", title: "Migrate events pipeline to new warehouse schema", project: "p3", assignee: "u3", priority: "urgent", status: "in_progress", labels: ["data", "infra"], due: "Jul 09", estimate: 24, spent: 31, aiFlag: "Over estimate · overdue" },
  { id: "t7", key: "CHAT-29", title: "Fine-tune fallback responses for billing intents", project: "p4", assignee: "u5", priority: "medium", status: "in_review", labels: ["chat"], due: "Jul 15", estimate: 6, spent: 5 },
  { id: "t8", key: "BANK-135", title: "Rate limiting on transfers API", project: "p1", assignee: "u1", priority: "high", status: "done", labels: ["backend", "security"], due: "Jul 08", estimate: 8, spent: 7 },
  { id: "t9", key: "PORT-85", title: "SSO login with Microsoft Entra", project: "p2", assignee: "u5", priority: "high", status: "backlog", labels: ["auth"], due: "Jul 21", estimate: 12, spent: 0 },
  { id: "t10", key: "CHAT-31", title: "Human handoff flow when confidence < 70%", project: "p4", assignee: "u6", priority: "high", status: "todo", labels: ["ux"], due: "Jul 17", estimate: 8, spent: 0 },
  { id: "t11", key: "DATA-48", title: "Backfill 2024 events with dedup pass", project: "p3", assignee: "u1", priority: "medium", status: "backlog", labels: ["data"], due: "Jul 24", estimate: 14, spent: 0 },
  { id: "t12", key: "BANK-144", title: "Push notification service for payment alerts", project: "p1", assignee: "u3", priority: "medium", status: "in_progress", labels: ["backend", "mobile"], due: "Jul 15", estimate: 10, spent: 4 },
];

export const riskAlerts = [
  { id: "r1", level: "critical" as RiskLevel, title: "Data Platform Migration is past its Jul 18 deadline", detail: "3 tasks unresolved for 6+ days. Rohan Patel is assigned 51h against a 40h capacity.", action: "Rebalance tasks" },
  { id: "r2", level: "warning" as RiskLevel, title: "Design review bottleneck in Customer Portal", detail: "PORT-91 is overdue and blocks 5 downstream frontend tasks.", action: "Escalate review" },
  { id: "r3", level: "warning" as RiskLevel, title: "Rohan Patel is over capacity", detail: "51h assigned vs 40h capacity, 3 weeks running.", action: "Reduce load by 11h" },
];

export const activityFeed = [
  { id: "f1", who: "Sara Iyer", what: "merged PR #482 for BANK-138", when: "12m ago" },
  { id: "f2", who: "Aarav Shah", what: "moved BANK-135 to Done", when: "38m ago" },
  { id: "f3", who: "Priya Mehta", what: "commented on PORT-88: “Use the new tokens for spacing”", when: "1h ago" },
  { id: "f4", who: "Dev Kapoor", what: "logged 3h on CHAT-29", when: "2h ago" },
  { id: "f5", who: "Nisha Rao", what: "closed Sprint 13 with a retrospective", when: "3h ago" },
  { id: "f6", who: "Nisha Rao", what: "created BANK-152", when: "5h ago" },
];

// Burndown: ideal vs actual remaining points across a 10-day sprint
export const burndown = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Tue", "Wed", "Thu", "Fri"],
  ideal: [40, 36, 31, 27, 22, 18, 13, 9, 4, 0],
  actual: [40, 38, 35, 33, 27, 24, 22, 17, null, null] as (number | null)[],
};

export const velocity = [
  { sprint: "S9", committed: 34, completed: 31 },
  { sprint: "S10", committed: 38, completed: 36 },
  { sprint: "S11", committed: 36, completed: 29 },
  { sprint: "S12", committed: 40, completed: 38 },
  { sprint: "S13", committed: 42, completed: 41 },
];

// hours logged per member per weekday (workload heatmap)
export const workloadHeat = members.map((m) => ({
  member: m,
  days: m.id === "u3" ? [9, 10, 11, 10, 11] : m.id === "u2" ? [8, 9, 9, 10, 8] : m.id === "u4" ? [6, 5, 6, 5, 6] : [7, 7, 8, 7, 6],
}));

export const statusMeta: Record<Status, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "var(--ink-3)" },
  todo: { label: "To Do", color: "var(--series-1)" },
  in_progress: { label: "In Progress", color: "var(--series-3)" },
  in_review: { label: "In Review", color: "var(--series-4)" },
  done: { label: "Done", color: "var(--series-2)" },
};

export const priorityMeta: Record<Priority, { label: string; color: string; soft: string }> = {
  urgent: { label: "Urgent", color: "var(--critical)", soft: "var(--critical-soft)" },
  high: { label: "High", color: "var(--serious)", soft: "var(--warn-soft)" },
  medium: { label: "Medium", color: "var(--series-1)", soft: "var(--brand-soft)" },
  low: { label: "Low", color: "var(--ink-3)", soft: "var(--surface-2)" },
};

export const riskMeta: Record<RiskLevel, { label: string; color: string; soft: string }> = {
  good: { label: "On Track", color: "var(--good)", soft: "var(--good-soft)" },
  warning: { label: "At Risk", color: "var(--warn)", soft: "var(--warn-soft)" },
  serious: { label: "Slipping", color: "var(--serious)", soft: "var(--warn-soft)" },
  critical: { label: "Critical", color: "var(--critical)", soft: "var(--critical-soft)" },
};

export const memberById = (id: string) => members.find((m) => m.id === id)!;
export const projectById = (id: string) => projects.find((p) => p.id === id)!;
export const tasksForProject = (id: string) => tasks.filter((t) => t.project === id);
