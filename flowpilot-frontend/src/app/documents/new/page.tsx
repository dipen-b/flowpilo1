"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Textarea from "@/components/ui/Textarea";
import { useDocumentsStore } from "@/stores/documents";
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

function NewDocumentContent() {
  const router = useRouter();
  const { addDocument } = useDocumentsStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other" as const,
    visibility: "team" as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Document title is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      const today = new Date().toISOString().split('T')[0];
      addDocument({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        author: "John Doe",
        createdDate: today,
        updatedDate: today,
        visibility: formData.visibility,
      });
      router.push("/documents");
      return;
    }
    setErrors(newErrors);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/documents" className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create New Document</h1>
          <p className="text-secondary-text">Add a new document to your knowledge base</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Title" error={errors.title} required>
                <Input
                  placeholder="e.g., API Documentation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? "border-red-500" : ""}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  placeholder="What is this document about?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-card-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                  >
                    <option value="requirements">Requirements</option>
                    <option value="design">Design</option>
                    <option value="notes">Notes</option>
                    <option value="specifications">Specifications</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>

                <FormField label="Visibility">
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                    className="w-full px-3 py-2 bg-card-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                  >
                    <option value="team">Team</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Create Document
            </Button>
            <Link href="/documents" className="flex-1">
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

export default function NewDocument() {
  return (
    <ProtectedRoute>
      <NewDocumentContent />
    </ProtectedRoute>
  );
}
