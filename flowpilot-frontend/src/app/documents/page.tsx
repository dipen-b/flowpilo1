"use client";

import { AppLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Plus, FileText, Lock, Globe, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useDocumentsStore } from "@/stores/documents";

const categoryConfig = {
  requirements: { label: "Requirements", color: "text-blue-500 bg-blue-500/10" },
  design: { label: "Design", color: "text-purple-500 bg-purple-500/10" },
  notes: { label: "Notes", color: "text-orange-500 bg-orange-500/10" },
  specifications: { label: "Specifications", color: "text-green-500 bg-green-500/10" },
  other: { label: "Other", color: "text-gray-500 bg-gray-500/10" },
};

const visibilityConfig = {
  public: { label: "Public", icon: Globe },
  private: { label: "Private", icon: Lock },
  team: { label: "Team", icon: FileText },
};

function DocumentsContent() {
  const { documents, deleteDocument } = useDocumentsStore();
  const [search, setSearch] = useState("");

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.description?.toLowerCase().includes(search.toLowerCase())
  );

  const publicDocs = documents.filter(d => d.visibility === "public").length;
  const privateDocs = documents.filter(d => d.visibility === "private").length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText size={32} className="text-primary-text" />
              <div>
                <h1 className="text-4xl font-bold text-primary-text">Documents</h1>
                <p className="text-lg text-secondary-text">Collaborate and manage team documents</p>
              </div>
            </div>
          </div>
          <Link href="/documents/new">
            <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <Plus size={18} />
              New Document
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Total Documents</p>
                <p className="text-4xl font-bold text-primary-text">{documents.length}</p>
              </div>
              <FileText size={28} className="text-secondary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Public</p>
                <p className="text-4xl font-bold text-primary-text">{publicDocs}</p>
              </div>
              <Globe size={28} className="text-primary-text" />
            </div>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Private</p>
                <p className="text-4xl font-bold text-primary-text">{privateDocs}</p>
              </div>
              <Lock size={28} className="text-primary-text" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text" size={18} />
          <input
            type="text"
            placeholder="Search documents by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-secondary-bg border border-border rounded-lg text-base text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text/50 transition-colors"
          />
        </div>

        {/* Documents List */}
        {filteredDocs.length === 0 ? (
          <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
            <FileText size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
            <p className="text-lg text-secondary-text mb-6">{search ? "No documents match your search" : "No documents created yet"}</p>
            {!search && (
              <Link href="/documents/new">
                <button className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all">
                  Create your first document
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map(doc => {
              const catCfg = categoryConfig[doc.category];
              const VisIcon = visibilityConfig[doc.visibility].icon;
              return (
                <div key={doc.id} className="bg-secondary-bg rounded-lg border border-border p-6 hover:border-primary-text/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title and Category */}
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <FileText size={18} className="text-secondary-text flex-shrink-0" />
                        <h3 className="text-lg font-bold text-primary-text">{doc.title}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${catCfg.color} flex-shrink-0`}>
                          {catCfg.label}
                        </span>
                      </div>

                      {/* Description */}
                      {doc.description && (
                        <p className="text-base text-secondary-text mb-3">{doc.description}</p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-secondary-text flex-wrap">
                        <span className="font-medium">By {doc.author}</span>
                        <span>•</span>
                        <span>Updated {doc.updatedDate}</span>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <VisIcon size={14} />
                          <span>{visibilityConfig[doc.visibility].label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/documents/${doc.id}/edit`}>
                        <button className="p-2 rounded-lg hover:bg-card-bg text-secondary-text hover:text-primary-text transition-colors">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                            deleteDocument(doc.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-secondary-text hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
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

export default function Documents() {
  return (
    <ProtectedRoute>
      <DocumentsContent />
    </ProtectedRoute>
  );
}
