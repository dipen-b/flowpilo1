"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import { useRoadmapsStore } from "@/stores/roadmaps";

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

function EditRoadmapContent() {
  const params = useParams();
  const router = useRouter();
  const roadmapId = params.id as string;
  const { getRoadmap, updateRoadmap } = useRoadmapsStore();

  const roadmap = getRoadmap(roadmapId);

  const [formData, setFormData] = useState(
    roadmap ? {
      name: roadmap.name,
      project: roadmap.project,
      status: roadmap.status,
      progress: roadmap.progress,
      startDate: roadmap.startDate,
      endDate: roadmap.endDate,
      owner: roadmap.owner,
      items: roadmap.items,
    } : {
      name: "",
      project: "",
      status: "planning" as const,
      progress: 0,
      startDate: "",
      endDate: "",
      owner: "",
      items: 0,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!roadmap) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-secondary-text mb-4">Roadmap not found</p>
          <Link href="/roadmaps">
            <Button>Back to Roadmaps</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Roadmap name is required";
    if (!formData.project.trim()) newErrors.project = "Project is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.dates = "Start date must be before end date";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      updateRoadmap(roadmapId, {
        name: formData.name,
        project: formData.project,
        status: formData.status,
        progress: formData.progress,
        startDate: formData.startDate,
        endDate: formData.endDate,
        owner: formData.owner,
        items: formData.items,
      });
      router.push("/roadmaps");
      return;
    }
    setErrors(newErrors);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/roadmaps" className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Roadmaps
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Roadmap</h1>
          <p className="text-secondary-text">{roadmap.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Roadmap Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Roadmap Name" error={errors.name} required>
                <Input
                  placeholder="Roadmap name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
              </FormField>

              <FormField label="Project" error={errors.project} required>
                <Input
                  placeholder="Project name"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className={errors.project ? "border-red-500" : ""}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Roadmap Details</CardTitle>
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
                    <option value="completed">Completed</option>
                  </select>
                </FormField>

                <FormField label="Progress (%)">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                  />
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
              {errors.dates && (
                <p className="text-sm text-primary-text">{errors.dates}</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Link href="/roadmaps" className="flex-1">
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

export default function EditRoadmap() {
  return (
    <ProtectedRoute>
      <EditRoadmapContent />
    </ProtectedRoute>
  );
}
