"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Plus,
  Edit,
  Trash2,
  Type,
  Calendar,
  Users,
  Tag,
  CheckSquare,
  Percent,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "date" | "checkbox" | "user" | "formula";
  description: string;
  required: boolean;
  options?: string[];
  usedIn: number;
  createdBy: string;
  createdAt: Date;
}

const CUSTOM_FIELDS: CustomField[] = [
  {
    id: "field-1",
    name: "Priority Level",
    type: "select",
    description: "Task priority classification",
    required: true,
    options: ["Low", "Medium", "High", "Critical"],
    usedIn: 41,
    createdBy: "John Doe",
    createdAt: new Date(2026, 0, 15),
  },
  {
    id: "field-2",
    name: "Estimated Hours",
    type: "number",
    description: "Time estimate for task completion",
    required: false,
    usedIn: 28,
    createdBy: "Sarah Wilson",
    createdAt: new Date(2026, 0, 20),
  },
  {
    id: "field-3",
    name: "Target Release Date",
    type: "date",
    description: "When this feature should be released",
    required: false,
    usedIn: 15,
    createdBy: "Mike Johnson",
    createdAt: new Date(2026, 0, 25),
  },
  {
    id: "field-4",
    name: "Is Blocked",
    type: "checkbox",
    description: "Task blocked by dependencies",
    required: false,
    usedIn: 12,
    createdBy: "Jane Smith",
    createdAt: new Date(2026, 1, 1),
  },
  {
    id: "field-5",
    name: "Code Reviewer",
    type: "user",
    description: "Person responsible for code review",
    required: false,
    usedIn: 8,
    createdBy: "Emma Davis",
    createdAt: new Date(2026, 1, 5),
  },
  {
    id: "field-6",
    name: "Completion Percentage",
    type: "formula",
    description: "Auto-calculated progress percentage",
    required: false,
    usedIn: 6,
    createdBy: "John Doe",
    createdAt: new Date(2026, 1, 10),
  },
];

function FieldTypeIcon({ type }: { type: CustomField["type"] }) {
  switch (type) {
    case "text":
      return <Type size={16} />;
    case "number":
      return <Percent size={16} />;
    case "select":
      return <Tag size={16} />;
    case "date":
      return <Calendar size={16} />;
    case "checkbox":
      return <CheckSquare size={16} />;
    case "user":
      return <Users size={16} />;
    case "formula":
      return <AlertCircle size={16} />;
    default:
      return <Type size={16} />;
  }
}

function CustomFieldsContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "text" as CustomField["type"],
    description: "",
    required: false,
  });

  const handleCreate = () => {
    setShowCreateModal(false);
    setFormData({ name: "", type: "text", description: "", required: false });
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Custom Fields</h1>
            <p className="text-secondary-text">Create and manage custom fields for your workspace</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            New Field
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Fields</p>
                <p className="text-2xl font-bold text-primary-text">{CUSTOM_FIELDS.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Field Types</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(CUSTOM_FIELDS.map((f) => f.type)).size}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Usage</p>
                <p className="text-2xl font-bold text-green-600">
                  {CUSTOM_FIELDS.reduce((sum, f) => sum + f.usedIn, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Fields List */}
        <Card>
          <CardHeader>
            <CardTitle>All Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CUSTOM_FIELDS.map((field) => (
                <div
                  key={field.id}
                  className="p-4 rounded-lg border border-border hover:bg-secondary-bg transition-colors flex items-center justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      <FieldTypeIcon type={field.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-primary-text">{field.name}</h3>
                        {field.required && (
                          <span className="text-xs text-red-600">* Required</span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-text mb-2">{field.description}</p>
                      <div className="flex items-center gap-4 text-xs text-secondary-text">
                        <span>Type: {field.type}</span>
                        <span>Used in {field.usedIn} items</span>
                        <span>Created by {field.createdBy}</span>
                      </div>
                      {field.options && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {field.options.map((option) => (
                            <Badge key={option} variant="secondary" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="secondary" className="px-2">
                      <Edit size={14} />
                    </Button>
                    <Button size="sm" variant="secondary" className="px-2">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Field Type Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Available Field Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: "text", label: "Text", description: "Single or multi-line text input" },
                { type: "number", label: "Number", description: "Integer or decimal numbers" },
                { type: "select", label: "Select", description: "Dropdown with predefined options" },
                { type: "date", label: "Date", description: "Calendar date picker" },
                { type: "checkbox", label: "Checkbox", description: "Boolean true/false toggle" },
                { type: "user", label: "User", description: "Assign to team members" },
              ].map((item) => (
                <div key={item.type} className="p-3 rounded-lg bg-secondary-bg border border-border">
                  <p className="font-semibold text-primary-text text-sm">{item.label}</p>
                  <p className="text-xs text-secondary-text mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Field Modal */}
        {showCreateModal && (
          <Card className="border-primary-text border-2 fixed bottom-8 right-8 w-96 z-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Custom Field</CardTitle>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-secondary-text hover:text-primary-text"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Field Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sprint Assignment"
                  className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Field Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomField["type"] })}
                  className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="date">Date</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="user">User</option>
                  <option value="formula">Formula</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this field is for..."
                  rows={2}
                  className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="required" className="text-sm text-primary-text">
                  Make this field required
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleCreate} className="flex-1">
                  Create
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

export default function CustomFields() {
  return (
    <ProtectedRoute>
      <CustomFieldsContent />
    </ProtectedRoute>
  );
}
