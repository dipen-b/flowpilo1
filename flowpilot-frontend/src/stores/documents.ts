import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: "requirements" | "design" | "notes" | "specifications" | "other";
  author: string;
  createdDate: string;
  updatedDate: string;
  visibility: "public" | "private" | "team";
}

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    title: "Project Requirements",
    description: "Complete requirements for FlowPilot project",
    category: "requirements",
    author: "John Doe",
    createdDate: "2026-07-01",
    updatedDate: "2026-07-29",
    visibility: "team",
  },
  {
    id: "doc-2",
    title: "API Design Specification",
    description: "REST API design and endpoints",
    category: "specifications",
    author: "Bob Johnson",
    createdDate: "2026-07-05",
    updatedDate: "2026-07-20",
    visibility: "team",
  },
  {
    id: "doc-3",
    title: "UI/UX Design Guidelines",
    description: "Design system and component guidelines",
    category: "design",
    author: "Jane Smith",
    createdDate: "2026-07-10",
    updatedDate: "2026-07-25",
    visibility: "public",
  },
];

interface DocumentsStore {
  documents: Document[];
  addDocument: (document: Omit<Document, "id">) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => Document | undefined;
}

export const useDocumentsStore = create<DocumentsStore>(
  persist(
    (set, get) => ({
      documents: INITIAL_DOCUMENTS,

      addDocument: (documentData) => {
        const newDocument: Document = {
          ...documentData,
          id: `doc-${Date.now()}`,
        };
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));
        return newDocument;
      },

      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));
      },

      getDocument: (id) => {
        return get().documents.find((d) => d.id === id);
      },
    }),
    {
      name: "documents-store",
      getStorage: () => localStorage,
      onRehydrate: (state) => {
        if (!state.documents.some((d) => d.id === "doc-1")) {
          state.documents = [...INITIAL_DOCUMENTS, ...state.documents.filter((d) => !d.id.startsWith("doc-"))];
        }
      },
    }
  )
);
