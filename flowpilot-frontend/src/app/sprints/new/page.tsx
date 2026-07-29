"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import { useSprintsStore } from "@/stores/sprints";
import { useRouter } from "next/navigation";

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

function NewSprintContent() {
  const router = useRouter();
  const { addSprint } = useSprintsStore();
  const [formData, setFormData] = useState({
    name: "",
    project: "FlowPilot Frontend",
    status: "planning" as const,
    goal: "",
    startDate: "",
    endDate: "",
    tasks: 0,
    completed: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Sprint name is required";
    if (!formData.goal.trim()) newErrors.goal = "Sprint goal is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.dates = "Start date must be before end date";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      addSprint({
        name: formData.name,
        project: formData.project,
        status: formData.status,
        goal: formData.goal,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tasks: formData.tasks,
        completed: formData.completed,
      });
      router.push("/sprints");
      return;
    }
    setErrors(newErrors);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/sprints" className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Sprints
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create New Sprint</h1>
          <p className="text-secondary-text">Plan and organize your team's work</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Sprint Name" error={errors.name} required>
                <Input
                  placeholder="e.g., Sprint 5: User Features"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
              </FormField>

              <FormField label="Sprint Goal" error={errors.goal} required>
                <Textarea
                  placeholder="What do you want to accomplish in this sprint?"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className={errors.goal ? "border-red-500" : ""}
                  rows={3}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Project">
                  <Input
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-card-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date" error={errors.dates}>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </FormField>

                <FormField label="End Date" error={errors.dates}>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Create Sprint
            </Button>
            <Link href="/sprints" className="flex-1">
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

export default function NewSprint() {
  return (
    <ProtectedRoute>
      <NewSprintContent />
    </ProtectedRoute>
  );
}
