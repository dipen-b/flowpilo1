"use client";

import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Plus, Trash2, Edit, Users, TrendingUp } from "lucide-react";
import { useTeamsStore } from "@/stores/teams";

function TeamsContent() {
  const { teams, deleteTeam } = useTeamsStore();

  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
  const totalTasks = teams.reduce((sum, team) => sum + team.totalTasks, 0);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users size={32} className="text-primary-text" />
              <div>
                <h1 className="text-4xl font-bold text-primary-text">Teams</h1>
                <p className="text-lg text-secondary-text">Manage team members and permissions</p>
              </div>
            </div>
          </div>
          <Link href="/teams/new">
            <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <Plus size={18} />
              New Team
            </button>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Total Teams</p>
                <p className="text-4xl font-bold text-primary-text">{teams.length}</p>
              </div>
              <Users size={28} className="text-secondary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Total Members</p>
                <p className="text-4xl font-bold text-primary-text">{totalMembers}</p>
              </div>
              <Users size={28} className="text-primary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Total Tasks</p>
                <p className="text-4xl font-bold text-primary-text">{totalTasks}</p>
              </div>
              <TrendingUp size={28} className="text-primary-text" />
            </div>
          </div>
        </div>

        {/* Teams List */}
        {teams.length === 0 ? (
          <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
            <Users size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
            <p className="text-lg text-secondary-text mb-6">No teams created yet</p>
            <Link href="/teams/new">
              <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all">
                Create your first team
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.id} className="bg-secondary-bg rounded-lg border border-border p-6 hover:border-primary-text/20 transition-all space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary-text mb-1">{team.name}</h3>
                    {team.description && (
                      <p className="text-base text-secondary-text">{team.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/teams/${team.id}/edit`}>
                      <button className="p-2 rounded-lg hover:bg-card-bg text-secondary-text hover:text-primary-text transition-colors">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${team.name}" team?`)) {
                          deleteTeam(team.id);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-secondary-text hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Members</p>
                    <p className="text-2xl font-bold text-primary-text">{team.members.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Total Tasks</p>
                    <p className="text-2xl font-bold text-primary-text">{team.totalTasks}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-secondary-text uppercase tracking-wide">Avg Workload</p>
                    <p className="text-2xl font-bold text-primary-text">{team.avgWorkload}%</p>
                  </div>
                </div>

                {/* Team Members Preview */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-secondary-text mb-3">Members ({team.members.length})</p>
                  <div className="space-y-2">
                    {team.members.slice(0, 3).map(member => (
                      <div key={member.id} className="flex items-center justify-between">
                        <span className="text-base text-primary-text font-medium">{member.name}</span>
                        <Badge className="text-xs font-semibold px-2 py-1">{member.role}</Badge>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <p className="text-sm text-secondary-text pt-2">+{team.members.length - 3} more members</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Teams() {
  return (
    <ProtectedRoute>
      <TeamsContent />
    </ProtectedRoute>
  );
}
