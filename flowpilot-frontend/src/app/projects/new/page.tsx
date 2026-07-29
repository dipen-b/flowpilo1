"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import { useProjectsStore } from "@/stores/projects";
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

function ProjectFormContent() {
  const router = useRouter();
  const { addProject } = useProjectsStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    priority: "medium" as const,
    startDate: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.startDate && formData.dueDate && new Date(formData.startDate) > new Date(formData.dueDate)) {
      newErrors.dates = "Start date must be before due date";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      addProject({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        owner: { id: "user-1", name: "John Doe" },
      });
      router.push(ROUTES.PROJECTS);
      return;
    }
    setErrors(newErrors);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={ROUTES.PROJECTS} className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-secondary-text">Set up a new project to organize your work</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Project Name"
                error={errors.name}
                required
              >
                <Input
                  placeholder="e.g., Mobile App Redesign"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Description"
                error={errors.description}
                required
              >
                <Textarea
                  placeholder="Describe the project goals and scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={errors.description ? "border-red-500" : ""}
                  rows={4}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Status">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-card-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="at_risk">At Risk</option>
                    <option value="completed">Completed</option>
                  </select>
                </FormField>

                <FormField label="Priority">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-card-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
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

                <FormField label="Due Date" error={errors.dates}>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </FormField>
              </div>
              {errors.dates && (
                <p className="text-sm text-primary-text">{errors.dates}</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Create Project
            </Button>
            <Link href={ROUTES.PROJECTS} className="flex-1">
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

export default function NewProject() {
  return (
    <ProtectedRoute>
      <ProjectFormContent />
    </ProtectedRoute>
  );
}
