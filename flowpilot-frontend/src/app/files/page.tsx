"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Upload,
  Download,
  Trash2,
  Share2,
  Eye,
  MoreVertical,
  File,
  FileImage,
  FileText,
  Lock,
  Clock,
  Search,
  X,
  Users,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useMemo } from "react";

interface FileEntry {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "archive" | "other";
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  sharedWith: number;
  isPrivate: boolean;
  versions: number;
  preview?: string;
}

const FILES: FileEntry[] = [
  {
    id: "file-1",
    name: "Project Requirements.pdf",
    type: "document",
    size: 2.4,
    uploadedBy: "John Doe",
    uploadedAt: new Date(2026, 1, 28, 14, 30),
    sharedWith: 3,
    isPrivate: false,
    versions: 2,
  },
  {
    id: "file-2",
    name: "Dashboard Mockup.figma",
    type: "document",
    size: 5.8,
    uploadedBy: "Sarah Wilson",
    uploadedAt: new Date(2026, 1, 27, 10, 15),
    sharedWith: 5,
    isPrivate: false,
    versions: 4,
  },
  {
    id: "file-3",
    name: "Team Photo.jpg",
    type: "image",
    size: 3.2,
    uploadedBy: "Jane Smith",
    uploadedAt: new Date(2026, 1, 26, 16, 45),
    sharedWith: 0,
    isPrivate: true,
    versions: 1,
  },
  {
    id: "file-4",
    name: "Sprint Retrospective.docx",
    type: "document",
    size: 1.1,
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date(2026, 1, 25, 13, 20),
    sharedWith: 2,
    isPrivate: false,
    versions: 1,
  },
  {
    id: "file-5",
    name: "API Documentation.pdf",
    type: "document",
    size: 4.5,
    uploadedBy: "Emma Davis",
    uploadedAt: new Date(2026, 1, 24, 11, 0),
    sharedWith: 8,
    isPrivate: false,
    versions: 5,
  },
  {
    id: "file-6",
    name: "Database Schema.png",
    type: "image",
    size: 1.8,
    uploadedBy: "John Doe",
    uploadedAt: new Date(2026, 1, 23, 9, 30),
    sharedWith: 4,
    isPrivate: false,
    versions: 3,
  },
];

function FileIcon({ type }: { type: FileEntry["type"] }) {
  switch (type) {
    case "image":
      return <FileImage size={20} className="text-pink-600" />;
    case "document":
      return <FileText size={20} className="text-blue-600" />;
    case "video":
      return <FileText size={20} className="text-red-600" />;
    case "archive":
      return <File size={20} className="text-orange-600" />;
    default:
      return <File size={20} className="text-gray-600" />;
  }
}

function FilesContent() {
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<FileEntry | null>(null);
  const [shareFile, setShareFile] = useState<FileEntry | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [shareSettings, setShareSettings] = useState({
    type: "private" as "private" | "team" | "public",
    canEdit: false,
    sharedWith: [] as string[],
    expiresAt: null as string | null,
  });

  const formatFileSize = (mb: number): string => {
    if (mb < 1) return (mb * 1024).toFixed(0) + " KB";
    if (mb < 1024) return mb.toFixed(1) + " MB";
    return (mb / 1024).toFixed(1) + " GB";
  };

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...FILES];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((file) =>
        file.name.toLowerCase().includes(query) ||
        file.uploadedBy.toLowerCase().includes(query)
      );
    }

    // Filter by file type
    if (fileTypeFilter) {
      result = result.filter((file) => file.type === fileTypeFilter);
    }

    // Filter by size
    if (sizeFilter) {
      result = result.filter((file) => {
        switch (sizeFilter) {
          case "small":
            return file.size < 1;
          case "medium":
            return file.size >= 1 && file.size < 10;
          case "large":
            return file.size >= 10;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "date":
        default:
          return b.uploadedAt.getTime() - a.uploadedAt.getTime();
      }
    });

    return result;
  }, [searchQuery, sortBy, fileTypeFilter, sizeFilter]);

  const totalSize = FILES.reduce((sum, file) => sum + file.size, 0);
  const totalFiles = FILES.length;
  const sharedFiles = FILES.filter((f) => f.sharedWith > 0).length;
  const filteredCount = filteredAndSortedFiles.length;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Handle dropped files
      const fileList = Array.from(files).map((file) => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1),
      }));

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(0);
          setTimeout(() => setShowUploadModal(false), 800);
        }
        setUploadProgress(progress);
      }, 300);

      console.log("Files dropped:", fileList);
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">File Management</h1>
            <p className="text-secondary-text">Upload, organize, and share files</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            Upload File
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Files</p>
                <p className="text-2xl font-bold text-primary-text">{totalFiles}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Storage</p>
                <p className="text-2xl font-bold text-primary-text">{totalSize.toFixed(1)} MB</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Shared Files</p>
                <p className="text-2xl font-bold text-green-600">{sharedFiles}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Versions</p>
                <p className="text-2xl font-bold text-blue-600">{FILES.reduce((sum, f) => sum + f.versions, 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text" />
            <input
              type="text"
              placeholder="Search files by name or uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-text hover:text-primary-text"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Button & Active Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showFilters || fileTypeFilter || sizeFilter
                  ? "bg-blue-600/20 border border-blue-600/30 text-blue-600"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text"
              }`}
            >
              ⚙️ Filters {(fileTypeFilter || sizeFilter) && "✓"}
            </button>

            {/* Active Filter Pills */}
            {fileTypeFilter && (
              <button
                onClick={() => setFileTypeFilter(null)}
                className="px-3 py-1.5 rounded-lg text-sm bg-blue-600/10 border border-blue-600/30 text-blue-600 hover:bg-blue-600/20 transition-colors"
              >
                {fileTypeFilter} ✕
              </button>
            )}
            {sizeFilter && (
              <button
                onClick={() => setSizeFilter(null)}
                className="px-3 py-1.5 rounded-lg text-sm bg-blue-600/10 border border-blue-600/30 text-blue-600 hover:bg-blue-600/20 transition-colors"
              >
                {sizeFilter === "small" ? "< 1 MB" : sizeFilter === "medium" ? "1-10 MB" : "> 10 MB"} ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-secondary-bg rounded-lg">
              <div>
                <p className="text-xs font-medium text-secondary-text mb-2">File Type</p>
                <select
                  value={fileTypeFilter || ""}
                  onChange={(e) => setFileTypeFilter(e.target.value || null)}
                  className="w-full px-2 py-1.5 bg-card-bg border border-border rounded text-sm text-primary-text focus:outline-none focus:border-primary-text"
                >
                  <option value="">All Types</option>
                  <option value="document">Documents</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="archive">Archives</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-text mb-2">File Size</p>
                <select
                  value={sizeFilter || ""}
                  onChange={(e) => setSizeFilter(e.target.value || null)}
                  className="w-full px-2 py-1.5 bg-card-bg border border-border rounded text-sm text-primary-text focus:outline-none focus:border-primary-text"
                >
                  <option value="">All Sizes</option>
                  <option value="small">Less than 1 MB</option>
                  <option value="medium">1 MB - 10 MB</option>
                  <option value="large">More than 10 MB</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-text">Sort by:</span>
            {(["date", "name", "size"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                  sortBy === option
                    ? "bg-black text-white"
                    : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {(["list", "grid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? "bg-black text-white"
                    : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Files {filteredCount < totalFiles && `(${filteredCount} of ${totalFiles})`}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary-text mb-2">
                  {searchQuery ? "No files match your search" : "No files yet"}
                </p>
                <p className="text-xs text-secondary-text">
                  {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-3">
                {filteredAndSortedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-lg border border-border hover:bg-secondary-bg transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <FileIcon type={file.type} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary-text truncate">{file.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-secondary-text mt-1">
                          <span>{formatFileSize(file.size)}</span>
                          <span>Uploaded by {file.uploadedBy}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {file.uploadedAt.toLocaleDateString("en-GB")}
                          </span>
                          {file.sharedWith > 0 && (
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {file.sharedWith} shared
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            {file.versions} version{file.versions > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.isPrivate && (
                        <Lock size={16} className="text-orange-600" />
                      )}
                      <Badge variant="secondary" className="text-xs capitalize">
                        {file.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="px-2"
                        onClick={() => setPreviewFile(file)}
                        title="Preview file"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" variant="secondary" className="px-2" title="Download file">
                        <Download size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="px-2"
                        onClick={() => {
                          setShareFile(file);
                          setShareSettings({
                            type: file.isPrivate ? "private" : "team",
                            canEdit: false,
                            sharedWith: [],
                            expiresAt: null,
                          });
                        }}
                        title="Share file"
                      >
                        <Share2 size={14} />
                      </Button>
                      <Button size="sm" variant="secondary" className="px-2">
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredAndSortedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-lg border border-border hover:bg-secondary-bg transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <FileIcon type={file.type} />
                      {file.isPrivate && <Lock size={14} className="text-orange-600" />}
                    </div>
                    <h3 className="font-semibold text-primary-text text-sm truncate mb-2">{file.name}</h3>
                    <p className="text-xs text-secondary-text mb-2">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-secondary-text mb-3">By {file.uploadedBy}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 text-xs"
                        onClick={() => setPreviewFile(file)}
                        title="Preview file"
                      >
                        <Eye size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 text-xs"
                        title="Download file"
                      >
                        <Download size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-card-bg border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upload Files</CardTitle>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadProgress(0);
                    }}
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                    className="text-secondary-text hover:text-primary-text disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadProgress > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-text">Uploading...</p>
                        <p className="text-xs text-secondary-text">{Math.round(uploadProgress)}%</p>
                      </div>
                      <div className="w-full h-2 bg-secondary-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                    {uploadProgress === 100 && (
                      <p className="text-xs text-green-600 text-center font-medium">✓ Upload complete</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        dragActive
                          ? "border-primary-text bg-primary-text/5"
                          : "border-border hover:border-primary-text/50"
                      }`}
                    >
                      <Upload size={40} className="mx-auto mb-4 text-secondary-text" />
                      <p className="font-semibold text-primary-text mb-1">
                        {dragActive ? "Drop files here" : "Drop files here or click to upload"}
                      </p>
                      <p className="text-sm text-secondary-text mb-4">
                        Supports images, documents, videos, and archives (max 100 MB each)
                      </p>
                      <Button variant="secondary" onClick={() => {}}>
                        Select Files
                      </Button>
                    </div>
                    <p className="text-xs text-secondary-text text-center">
                      📋 Supported formats: PNG, JPG, PDF, DOCX, MP4, ZIP
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl bg-card-bg border border-border max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>File Preview</CardTitle>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="text-secondary-text hover:text-primary-text"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Preview Area */}
                {previewFile.type === "image" ? (
                  <div className="bg-secondary-bg rounded-lg p-8 flex items-center justify-center min-h-64">
                    <div className="text-center">
                      <ImageIcon size={48} className="mx-auto mb-4 text-secondary-text" />
                      <p className="text-secondary-text">{previewFile.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary-bg rounded-lg p-8 flex items-center justify-center min-h-64">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-4 text-secondary-text" />
                      <p className="text-secondary-text">{previewFile.name}</p>
                    </div>
                  </div>
                )}

                {/* File Details */}
                <div className="space-y-4 border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-secondary-text mb-1">📄 File Name</p>
                      <p className="font-medium text-primary-text text-sm">{previewFile.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-text mb-1">💾 File Size</p>
                      <p className="font-medium text-primary-text text-sm">{formatFileSize(previewFile.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-text mb-1">👤 Uploaded By</p>
                      <p className="font-medium text-primary-text text-sm">{previewFile.uploadedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-text mb-1">📅 Uploaded On</p>
                      <p className="font-medium text-primary-text text-sm">
                        {previewFile.uploadedAt.toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-text mb-1">📋 Type</p>
                      <p className="font-medium text-primary-text text-sm capitalize">{previewFile.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-text mb-1">📝 Versions</p>
                      <p className="font-medium text-primary-text text-sm">{previewFile.versions}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-secondary-text mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      {previewFile.isPrivate ? (
                        <>
                          <Lock size={14} className="text-orange-600" />
                          <span className="text-sm text-primary-text">Private</span>
                        </>
                      ) : (
                        <>
                          <Users size={14} className="text-blue-600" />
                          <span className="text-sm text-primary-text">Shared with {previewFile.sharedWith} people</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 border-t border-border pt-4">
                  <Button className="flex-1" onClick={() => {}}>
                    Download
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => setPreviewFile(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Share Permissions Modal */}
        {shareFile && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-card-bg border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Share: {shareFile.name}</CardTitle>
                  <button
                    onClick={() => setShareFile(null)}
                    className="text-secondary-text hover:text-primary-text"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Share Type Selection */}
                <div>
                  <p className="text-sm font-medium text-primary-text mb-3">Who can access this file?</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShareSettings({ ...shareSettings, type: "private" })}
                      className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                        shareSettings.type === "private"
                          ? "border-primary-text bg-black/5"
                          : "border-border hover:border-primary-text/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Lock size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-primary-text">Private</p>
                          <p className="text-xs text-secondary-text">Only you can access</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setShareSettings({ ...shareSettings, type: "team" })}
                      className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                        shareSettings.type === "team"
                          ? "border-primary-text bg-black/5"
                          : "border-border hover:border-primary-text/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Users size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-primary-text">Team</p>
                          <p className="text-xs text-secondary-text">Share with specific people</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setShareSettings({ ...shareSettings, type: "public" })}
                      className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                        shareSettings.type === "public"
                          ? "border-primary-text bg-black/5"
                          : "border-border hover:border-primary-text/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Globe size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-primary-text">Public</p>
                          <p className="text-xs text-secondary-text">Anyone with link can access</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Permissions */}
                {shareSettings.type !== "private" && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareSettings.canEdit}
                        onChange={(e) =>
                          setShareSettings({ ...shareSettings, canEdit: e.target.checked })
                        }
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-primary-text">Allow editing</p>
                        <p className="text-xs text-secondary-text">Recipients can modify this file</p>
                      </div>
                    </label>

                    <div>
                      <p className="text-sm font-medium text-primary-text mb-2">Expiration Date (Optional)</p>
                      <input
                        type="date"
                        value={shareSettings.expiresAt || ""}
                        onChange={(e) =>
                          setShareSettings({ ...shareSettings, expiresAt: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-card-bg border border-border rounded-lg text-sm text-primary-text focus:outline-none focus:border-primary-text"
                      />
                      <p className="text-xs text-secondary-text mt-1">Access will be revoked after this date</p>
                    </div>

                    {/* Shared Users Preview */}
                    {shareSettings.type === "team" && (
                      <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                        <p className="text-xs font-medium text-blue-600 mb-2">Shared with:</p>
                        <p className="text-xs text-blue-500">3 team members selected</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 border-t border-border pt-4">
                  <Button className="flex-1" onClick={() => setShareFile(null)}>
                    Done
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShareFile(null);
                      // Here you would save the share settings
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Files() {
  return (
    <ProtectedRoute>
      <FilesContent />
    </ProtectedRoute>
  );
}
