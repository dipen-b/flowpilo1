"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { MOCK_PROJECTS, MOCK_TASKS } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

function DashboardContent() {
  const { user } = useAuth();
  const totalProjects = MOCK_PROJECTS.length;
  const activeProjects = MOCK_PROJECTS.filter((p: any) => p.status === "active").length;
  const completedTasks = MOCK_TASKS.filter((t: any) => t.status === "done").length;
  const totalTasks = MOCK_TASKS.length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-primary-text">Welcome back, {user?.name}!</h1>
          <p className="text-lg text-secondary-text">Here's your project overview</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-border bg-secondary-bg hover:border-primary-text/20 transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary-text">{totalProjects}</p>
                <p className="text-base text-secondary-text font-medium">Total Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-secondary-bg hover:border-primary-text/20 transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary-text">{activeProjects}</p>
                <p className="text-base text-secondary-text font-medium">Active Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-secondary-bg hover:border-primary-text/20 transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary-text">{completedTasks}</p>
                <p className="text-base text-secondary-text font-medium">Tasks Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-secondary-bg hover:border-primary-text/20 transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary-text">{totalTasks - completedTasks}</p>
                <p className="text-base text-secondary-text font-medium">Pending Tasks</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <Card className="lg:col-span-2 border border-border bg-secondary-bg">
            <CardHeader className="px-8 py-6 border-b border-border">
              <CardTitle className="text-2xl">Recent Projects</CardTitle>
              <CardDescription className="text-base">Your active projects</CardDescription>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <div className="space-y-5">
                {MOCK_PROJECTS.slice(0, 3).map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-card-bg rounded-lg hover:bg-primary-text/5 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-base text-primary-text">{project.name}</p>
                      <p className="text-sm text-secondary-text mt-1">{project.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      <div className="w-28 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-text transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-secondary-text text-right mt-2">{project.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border border-border bg-secondary-bg">
            <CardHeader className="px-8 py-6 border-b border-border">
              <CardTitle className="text-2xl">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-secondary-text font-medium mb-2">Completion Rate</p>
                  <p className="text-3xl font-bold text-primary-text">{Math.round((completedTasks / totalTasks) * 100)}%</p>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-secondary-text font-medium mb-2">Team Capacity</p>
                  <p className="text-3xl font-bold text-primary-text">85%</p>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-secondary-text font-medium mb-2">On-time Delivery</p>
                  <p className="text-3xl font-bold text-primary-text">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border border-border bg-secondary-bg">
          <CardHeader className="px-8 py-6 border-b border-border">
            <CardTitle className="text-2xl">Recent Activity</CardTitle>
            <CardDescription className="text-base">Updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="px-8 py-6">
            <div className="space-y-4">
              {[
                { user: "You", action: "completed task", item: "Build dashboard widgets" },
                { user: "John Doe", action: "updated", item: "FlowPilot Frontend" },
                { user: "Jane Smith", action: "commented on", item: "Database optimization" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-card-bg rounded-lg hover:bg-primary-text/5 transition-colors">
                  <div className="w-3 h-3 bg-primary-text rounded-full flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-primary-text">
                      <span className="font-semibold">{activity.user}</span> <span className="text-secondary-text">{activity.action}</span>{" "}
                      <span className="font-semibold">{activity.item}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
