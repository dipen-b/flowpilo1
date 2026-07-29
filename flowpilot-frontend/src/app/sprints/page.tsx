"use client";

import { AppLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Plus, TrendingDown, Target, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { useSprintsStore } from "@/stores/sprints";

const statusConfig = {
  planning: { label: "Planning", color: "text-gray-500 bg-gray-500/10" },
  active: { label: "Active", color: "text-green-500 bg-green-500/10" },
  completed: { label: "Completed", color: "text-blue-500 bg-blue-500/10" },
};

function SprintsContent() {
  const { sprints, deleteSprint } = useSprintsStore();

  const statusCounts = {
    planning: sprints.filter(s => s.status === "planning").length,
    active: sprints.filter(s => s.status === "active").length,
    completed: sprints.filter(s => s.status === "completed").length,
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-primary-text">Sprints</h1>
            <p className="text-lg text-secondary-text">Agile sprint planning and tracking</p>
          </div>
          <Link href="/sprints/new">
            <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <Plus size={18} />
              New Sprint
            </button>
          </Link>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Planning</p>
                <p className="text-4xl font-bold text-primary-text">{statusCounts.planning}</p>
              </div>
              <Target size={28} className="text-secondary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold text-primary-text">{statusCounts.active}</p>
              </div>
              <TrendingDown size={28} className="text-primary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Completed</p>
                <p className="text-4xl font-bold text-primary-text">{statusCounts.completed}</p>
              </div>
              <CheckCircle2 size={28} className="text-primary-text" />
            </div>
          </div>
        </div>

        {/* Sprints List */}
        {sprints.length === 0 ? (
          <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
            <Target size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
            <p className="text-lg text-secondary-text mb-6">No sprints created yet</p>
            <Link href="/sprints/new">
              <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all">
                Create your first sprint
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sprints.map(sprint => {
              const statusCfg = statusConfig[sprint.status];
              const daysRemaining = sprint.status === "completed" ? 0 :
                Math.ceil((new Date(sprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div key={sprint.id} className="bg-secondary-bg rounded-lg border border-border p-6 hover:border-primary-text/20 transition-all space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-primary-text">{sprint.name}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-base text-secondary-text">{sprint.goal}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/sprints/${sprint.id}/edit`}>
                        <button className="p-2 rounded-lg hover:bg-card-bg text-secondary-text hover:text-primary-text transition-colors">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${sprint.name}"?`)) {
                            deleteSprint(sprint.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-secondary-text hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Tasks</p>
                      <p className="text-2xl font-bold text-primary-text">{sprint.tasks}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Completed</p>
                      <p className="text-2xl font-bold text-primary-text">{sprint.completed}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Velocity</p>
                      <p className="text-2xl font-bold text-primary-text">{sprint.velocity || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Duration</p>
                      <p className="text-base text-primary-text">{sprint.startDate} to {sprint.endDate}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Sprints() {
  return (
    <ProtectedRoute>
      <SprintsContent />
    </ProtectedRoute>
  );
}
