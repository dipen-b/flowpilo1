import { AppLayout } from "@/components/layout";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants";

export default function Home() {
  return (
    <AppLayout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Welcome to FlowPilot</h1>
        <p className="text-secondary-text mb-8">Project Management Platform for Modern Teams</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card-bg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-secondary-text mb-4">View your projects, tasks, and team metrics</p>
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="primary" size="sm">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="bg-card-bg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-secondary-text mb-4">Manage and track your projects</p>
            <Link href={ROUTES.PROJECTS}>
              <Button variant="primary" size="sm">
                View Projects
              </Button>
            </Link>
          </div>

          <div className="bg-card-bg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-secondary-text mb-4">Create and manage tasks with your team</p>
            <Link href={ROUTES.TASKS}>
              <Button variant="primary" size="sm">
                View Tasks
              </Button>
            </Link>
          </div>

          <div className="bg-card-bg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Kanban Board</h2>
            <p className="text-secondary-text mb-4">Visualize your workflow with drag-and-drop</p>
            <Link href={ROUTES.KANBAN}>
              <Button variant="primary" size="sm">
                View Board
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-black/10 border border-primary-text/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-text mb-2">Phase 2 Complete ✓</h3>
          <p className="text-secondary-text">Core UI components and layout system built. Dashboard coming next...</p>
        </div>
      </div>
    </AppLayout>
  );
}
