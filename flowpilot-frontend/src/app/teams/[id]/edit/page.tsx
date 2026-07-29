"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import { useTeamsStore } from "@/stores/teams";

function FormField({ label, error, required, children }: { label?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-primary-text">
          {label}
          {required && <span className="text-primary-text ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-primary-text mt-1">{error}</p>
      )}
    </div>
  );
}

function EditTeamContent() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const { getTeam, updateTeam } = useTeamsStore();

  const team = getTeam(teamId);

  const [formData, setFormData] = useState(
    team ? {
      name: team.name,
      description: team.description || "",
    } : {
      name: "",
      description: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!team) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-secondary-text mb-4">Team not found</p>
          <Link href="/teams">
            <Button>Back to Teams</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Team name is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      updateTeam(teamId, {
        name: formData.name,
        description: formData.description,
      });
      router.push("/teams");
      return;
    }
    setErrors(newErrors);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/teams" className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Teams
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Team</h1>
          <p className="text-secondary-text">{team.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Team Name" error={errors.name} required>
                <Input
                  placeholder="Team name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  placeholder="Team description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({team.members.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {team.members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 border border-border rounded">
                  <div>
                    <p className="text-sm font-medium text-primary-text">{member.name}</p>
                    <p className="text-xs text-secondary-text">{member.email}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary-text bg-secondary-bg px-2 py-1 rounded">
                    {member.role}
                  </span>
                </div>
              ))}
              {team.members.length === 0 && (
                <p className="text-sm text-secondary-text">No members added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Link href="/teams" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default function EditTeam() {
  return (
    <ProtectedRoute>
      <EditTeamContent />
    </ProtectedRoute>
  );
}
