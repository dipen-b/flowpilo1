"use client";

import { AppLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Plus, TrendingUp, Calendar, Users, Edit, Trash2, Map } from "lucide-react";
import Link from "next/link";
import { useRoadmapsStore } from "@/stores/roadmaps";

const statusConfig = {
  planning: { label: "Planning", color: "text-gray-500 bg-gray-500/10" },
  active: { label: "Active", color: "text-green-500 bg-green-500/10" },
  completed: { label: "Completed", color: "text-blue-500 bg-blue-500/10" },
};

function RoadmapsContent() {
  const { roadmaps, deleteRoadmap } = useRoadmapsStore();

  const statusCounts = {
    planning: roadmaps.filter(r => r.status === "planning").length,
    active: roadmaps.filter(r => r.status === "active").length,
    completed: roadmaps.filter(r => r.status === "completed").length,
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Map size={32} className="text-primary-text" />
              <div>
                <h1 className="text-4xl font-bold text-primary-text">Roadmaps</h1>
                <p className="text-lg text-secondary-text">Strategic planning and release management</p>
              </div>
            </div>
          </div>
          <Link href="/roadmaps/new">
            <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <Plus size={18} />
              New Roadmap
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
              <Calendar size={28} className="text-secondary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold text-primary-text">{statusCounts.active}</p>
              </div>
              <TrendingUp size={28} className="text-primary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Completed</p>
                <p className="text-4xl font-bold text-primary-text">{statusCounts.completed}</p>
              </div>
              <div className="text-4xl font-bold text-primary-text">✓</div>
            </div>
          </div>
        </div>

        {/* Roadmaps Grid */}
        {roadmaps.length === 0 ? (
          <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
            <Map size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
            <p className="text-lg text-secondary-text mb-6">No roadmaps created yet</p>
            <Link href="/roadmaps/new">
              <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all">
                Create your first roadmap
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.map(roadmap => {
              const statusCfg = statusConfig[roadmap.status];
              return (
                <div key={roadmap.id} className="bg-secondary-bg rounded-lg border border-border p-6 hover:border-primary-text/20 transition-all space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-primary-text">{roadmap.name}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-secondary-text">Progress</span>
                      <span className="text-sm font-bold text-primary-text">{roadmap.progress}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-primary-text h-full transition-all"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-base text-secondary-text">
                      <span className="font-medium">Project:</span>
                      <span>{roadmap.project}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-secondary-text">
                      <Calendar size={16} />
                      <span>{roadmap.startDate} to {roadmap.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-secondary-text">
                      <Users size={16} />
                      <span>{roadmap.owner}</span>
                    </div>
                    <p className="text-sm text-secondary-text">{roadmap.items} items</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Link href={`/roadmaps/${roadmap.id}/edit`} className="flex-1">
                      <button className="w-full px-4 py-2 rounded-lg border border-border text-primary-text hover:bg-secondary-bg font-semibold transition-colors flex items-center justify-center gap-2 text-sm">
                        <Edit size={16} />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${roadmap.name}"?`)) {
                          deleteRoadmap(roadmap.id);
                        }
                      }}
                      className="px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 font-semibold transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default function Roadmaps() {
  return (
    <ProtectedRoute>
      <RoadmapsContent />
    </ProtectedRoute>
  );
}
