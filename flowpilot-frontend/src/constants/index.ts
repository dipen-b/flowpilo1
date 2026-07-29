// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",

  // Projects
  PROJECTS: "/projects",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  PROJECT_CREATE: "/projects",
  PROJECT_UPDATE: (id: string) => `/projects/${id}`,
  PROJECT_DELETE: (id: string) => `/projects/${id}`,

  // Tasks
  TASKS: "/tasks",
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  TASK_CREATE: "/tasks",
  TASK_UPDATE: (id: string) => `/tasks/${id}`,
  TASK_DELETE: (id: string) => `/tasks/${id}`,

  // Sprints
  SPRINTS: "/sprints",
  SPRINT_DETAIL: (id: string) => `/sprints/${id}`,

  // Dashboard
  DASHBOARD: "/dashboard",

  // Teams
  TEAMS: "/teams",
  TEAM_DETAIL: (id: string) => `/teams/${id}`,
};

// Status Colors
export const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-slate-600",
  todo: "bg-slate-500",
  in_progress: "bg-blue-500",
  review: "bg-purple-500",
  testing: "bg-yellow-500",
  done: "bg-green-500",
  blocked: "bg-red-500",
  cancelled: "bg-gray-600",
  planning: "bg-slate-500",
  active: "bg-blue-500",
  on_hold: "bg-yellow-500",
  at_risk: "bg-red-500",
  completed: "bg-green-500",
};

// Priority Colors
export const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

// Routes
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  TASKS: "/tasks",
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  KANBAN: "/kanban",
  TIMELINE: "/timeline",
  ROADMAP: "/roadmap",
  SPRINTS: "/sprints",
  SPRINT_DETAIL: (id: string) => `/sprints/${id}`,
  TEAMS: "/teams",
  DOCUMENTS: "/documents",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  ACTIVITY: "/activity",
  NOTIFICATIONS: "/notifications",
  FILES: "/files",
  CUSTOM_FIELDS: "/custom-fields",
  PERFORMANCE: "/performance",
  ERRORS: "/errors",
  LOAD_TESTING: "/load-testing",
  ANIMATIONS: "/animations",
  POLISH: "/polish",
  TESTING: "/testing",
  DEPLOYMENTS: "/deployments",
  SECURITY: "/security",
  DOCS: "/docs",
};

// Navigation Items
export const MAIN_NAVIGATION = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: "LayoutGrid" },
  { label: "Notifications", path: ROUTES.NOTIFICATIONS, icon: "Bell" },
  { label: "Inbox", path: "/inbox", icon: "Mail" },
  { label: "My Tasks", path: "/my-tasks", icon: "CheckCircle" },
  { label: "Projects", path: ROUTES.PROJECTS, icon: "Briefcase" },
  { label: "Kanban", path: ROUTES.KANBAN, icon: "Layers" },
  { label: "Roadmaps", path: "/roadmaps", icon: "Map" },
  { label: "Sprints", path: ROUTES.SPRINTS, icon: "Zap" },
  { label: "Timeline", path: ROUTES.TIMELINE, icon: "Clock" },
  { label: "Calendar", path: "/calendar", icon: "Calendar" },
  { label: "Teams", path: ROUTES.TEAMS, icon: "Users" },
  { label: "Documents", path: ROUTES.DOCUMENTS, icon: "FileText" },
  { label: "Reports", path: ROUTES.REPORTS, icon: "BarChart3" },
  { label: "Settings", path: ROUTES.SETTINGS, icon: "Settings" },
];

// Mock User
export const MOCK_USER: any = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  role: "owner",
  department: "Engineering",
};

// Mock Projects
export const MOCK_PROJECTS: any[] = [
  {
    id: "proj-1",
    name: "FlowPilot Frontend",
    description: "Next.js frontend application",
    owner: MOCK_USER,
    status: "active",
    priority: "high",
    progress: 65,
    startDate: "2026-01-15",
    dueDate: "2026-06-30",
  },
  {
    id: "proj-2",
    name: "FlowPilot Backend",
    description: "NestJS backend API",
    owner: MOCK_USER,
    status: "active",
    priority: "high",
    progress: 45,
    startDate: "2026-01-15",
    dueDate: "2026-06-30",
  },
  {
    id: "proj-3",
    name: "Mobile App",
    description: "React Native mobile app",
    owner: MOCK_USER,
    status: "planning",
    priority: "medium",
    progress: 10,
    startDate: "2026-04-01",
    dueDate: "2026-09-30",
  },
];

// Mock Tasks
export const MOCK_TASKS: any[] = [
  {
    id: "task-1",
    title: "Setup authentication",
    status: "done",
    priority: "high",
    assignee: MOCK_USER,
    dueDate: "2026-02-15",
    projectId: "proj-1",
  },
  {
    id: "task-2",
    title: "Build dashboard widgets",
    status: "in_progress",
    priority: "high",
    assignee: MOCK_USER,
    dueDate: "2026-03-01",
    projectId: "proj-1",
  },
  {
    id: "task-3",
    title: "Create API endpoints",
    status: "todo",
    priority: "high",
    assignee: MOCK_USER,
    dueDate: "2026-03-15",
    projectId: "proj-2",
  },
  {
    id: "task-4",
    title: "Database optimization",
    status: "backlog",
    priority: "medium",
    assignee: MOCK_USER,
    dueDate: "2026-04-01",
    projectId: "proj-2",
  },
];

// Mock Teams
export const MOCK_TEAMS: any[] = [
  {
    id: "team-1",
    name: "Frontend Team",
    members: [MOCK_USER],
  },
  {
    id: "team-2",
    name: "Backend Team",
    members: [MOCK_USER],
  },
];

// Mock Sprints
export const MOCK_SPRINTS: any[] = [
  {
    id: "sprint-1",
    name: "Sprint 1",
    startDate: "2026-02-01",
    endDate: "2026-02-14",
    goal: "Setup authentication and core infrastructure",
    status: "completed",
    projectId: "proj-1",
    tasks: [MOCK_TASKS[0]],
  },
  {
    id: "sprint-2",
    name: "Sprint 2",
    startDate: "2026-02-15",
    endDate: "2026-03-01",
    goal: "Build dashboard and core UI",
    status: "active",
    projectId: "proj-1",
    tasks: [MOCK_TASKS[1]],
  },
];
