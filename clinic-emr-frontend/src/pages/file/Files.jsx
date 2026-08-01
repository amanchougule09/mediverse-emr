import { useEffect, useState, useRef, useCallback } from "react";
import {
  getFiles,
  uploadFile,
  deleteFile,
  deleteFiles,
  downloadFile,
  getFileDownloadUrl,
} from "../../api/files";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";
import {
  Upload,
  Download,
  Trash2,
  Eye,
  Link2,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  X,
  Check,
  Search,
  Filter,
  FileUp,
} from "lucide-react";

const FILE_TYPE_MAP = {
  "image/": { icon: Image, color: "text-pink-500 bg-pink-50" },
  "application/pdf": { icon: FileText, color: "text-red-500 bg-red-50" },
  "application/msword": { icon: FileText, color: "text-blue-500 bg-blue-50" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, color: "text-blue-500 bg-blue-50" },
  "application/vnd.ms-excel": { icon: FileSpreadsheet, color: "text-emerald-500 bg-emerald-50" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: FileSpreadsheet, color: "text-emerald-500 bg-emerald-50" },
  "text/": { icon: FileText, color: "text-slate-500 bg-slate-50" },
};

function getFileTypeInfo(mimeType) {
  if (!mimeType) return { icon: File, color: "text-slate-400 bg-slate-100" };
  for (const [prefix, info] of Object.entries(FILE_TYPE_MAP)) {
    if (mimeType.startsWith(prefix)) return info;
  }
  return { icon: File, color: "text-slate-400 bg-slate-100" };
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

const SUPPORTED_PREVIEW_TYPES = ["image/", "application/pdf"];

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fileInputRef = useRef(null);
  const dropRef = useRef(null);
  const pollRef = useRef(null);

  const { sortedData, sortConfig, requestSort } = useSortableData(files, "id", "desc");
  const pagination = usePagination(sortedData);

  const fetchFiles = useCallback(async () => {
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (typeFilter) params.contentType = typeFilter;
      const res = await getFiles(params);
      setFiles(Array.isArray(res) ? res : res.content || []);
    } catch (err) {
      if (!search && !typeFilter) {
        toast.error(err?.response?.data?.message || "Failed to load files.");
      }
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    pollRef.current = setInterval(fetchFiles, 30000);
    return () => clearInterval(pollRef.current);
  }, [fetchFiles]);

  const addFilesToQueue = (fileList) => {
    const newFiles = Array.from(fileList).map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      progress: 0,
      status: "pending",
    }));
    setUploadQueue((prev) => [...prev, ...newFiles]);
    setShowUploadPanel(true);
    newFiles.forEach((f) => processUpload(f));
  };

  const processUpload = async (queueItem) => {
    setUploadQueue((prev) =>
      prev.map((q) => (q.id === queueItem.id ? { ...q, status: "uploading" } : q))
    );
    try {
      const fd = new FormData();
      fd.append("file", queueItem.file);
      if (uploadDescription.trim()) fd.append("description", uploadDescription.trim());
      await uploadFile(fd, (pct) => {
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === queueItem.id ? { ...q, progress: pct } : q))
        );
      });
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === queueItem.id ? { ...q, progress: 100, status: "done" } : q))
      );
      toast.success(`"${queueItem.file.name}" uploaded`);
      fetchFiles();
    } catch (err) {
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === queueItem.id ? { ...q, status: "error" } : q))
      );
      toast.error(err?.response?.data?.message || `Failed to upload "${queueItem.file.name}"`);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) addFilesToQueue(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) addFilesToQueue(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDownload = async (item) => {
    try {
      const response = await downloadFile(item.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.originalFileName || item.fileName || `file-${item.id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("File downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to download file.");
    }
  };

  const handleCopyLink = (item) => {
    const url = getFileDownloadUrl(item.id);
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Failed to copy link")
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFile(deleteTarget.id);
      toast.success("File deleted");
      setDeleteTarget(null);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
      fetchFiles();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete file.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      await deleteFiles([...selectedIds]);
      toast.success(`${selectedIds.size} file(s) deleted`);
      setSelectedIds(new Set());
      fetchFiles();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete files.");
    }
  };

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) return;
    try {
      const items = files.filter((f) => selectedIds.has(f.id));
      for (const item of items) {
        await handleDownload(item);
      }
    } catch {
      toast.error("Failed to download files.");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = pagination.paginatedData.map((f) => f.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        pageIds.forEach((id) => n.delete(id));
        return n;
      });
    } else {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        pageIds.forEach((id) => n.add(id));
        return n;
      });
    }
  };

  const handlePreview = async (item) => {
    setPreviewUrl(null);
    if (!item.contentType || !SUPPORTED_PREVIEW_TYPES.some((p) => item.contentType.startsWith(p))) {
      toast.error("Preview not available for this file type");
      return;
    }
    setViewItem(item);
    setPreviewLoading(true);
    try {
      if (item.contentType.startsWith("image/") || item.contentType === "application/pdf") {
        const response = await downloadFile(item.id);
        const blob = new Blob([response.data], { type: item.contentType });
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    } catch {
      toast.error("Failed to load preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const clearUploadQueue = () => {
    setUploadQueue([]);
    setShowUploadPanel(false);
    setUploadDescription("");
  };

  const activeUploads = uploadQueue.filter((q) => q.status === "uploading" || q.status === "pending");
  const doneUploads = uploadQueue.filter((q) => q.status === "done");
  const uploading = activeUploads.length > 0;

  const filteredTypeOptions = [
    { value: "", label: "All Types" },
    { value: "image", label: "Images" },
    { value: "application/pdf", label: "PDF" },
    { value: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Documents" },
    { value: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "Spreadsheets" },
  ];

  if (loading && files.length === 0) {
    return <LoadingSpinner message="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files"
        actionLabel="+ Upload Files"
        onAction={() => fileInputRef.current?.click()}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-blue-400 bg-blue-50 scale-[1.01]"
            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
        }`}
      >
        <FileUp className={`w-10 h-10 mx-auto mb-3 ${dragOver ? "text-blue-500" : "text-slate-300"}`} />
        <p className="text-sm font-medium text-slate-700">
          {dragOver ? "Drop files here" : "Drag & drop files here, or click to browse"}
        </p>
        <p className="text-xs text-slate-400 mt-1">Supports any file type, up to 100MB</p>
      </div>

      {/* Upload Queue Panel */}
      {showUploadPanel && uploadQueue.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              Upload Queue
              {uploading && (
                <span className="text-xs text-blue-500 font-normal">
                  ({activeUploads.length} active)
                </span>
              )}
            </h3>
            {!uploading && (
              <button onClick={clearUploadQueue} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {uploadQueue.length > 1 && (
            <div className="mb-2">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((doneUploads.length / uploadQueue.length) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {doneUploads.length} / {uploadQueue.length} completed
              </p>
            </div>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadQueue.map((q) => (
              <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                {q.status === "done" ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : q.status === "error" ? (
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{q.file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(q.file.size)}</p>
                </div>
                <div className="w-24">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        q.status === "error" ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${q.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-right mt-0.5">
                    {q.status === "done" ? "Done" : q.status === "error" ? "Failed" : `${q.progress}%`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
          >
            {filteredTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
          <span className="text-sm font-medium text-blue-700">{selectedIds.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleBulkDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              <Download className="w-3.5 h-3.5" /> Download All
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete All
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {files.length === 0 ? (
          <EmptyState message="No files found. Upload a file to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={pagination.paginatedData.length > 0 && pagination.paginatedData.every((f) => selectedIds.has(f.id))}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <SortableHeader
                      label="File Name"
                      sortKey="originalFileName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Type"
                      sortKey="contentType"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Size"
                      sortKey="fileSize"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Uploaded By"
                      sortKey="uploadedByName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Upload Date"
                      sortKey="uploadedAt"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                        No files match your filters.
                      </td>
                    </tr>
                  ) : (
                    pagination.paginatedData.map((item) => {
                      const typeInfo = getFileTypeInfo(item.contentType);
                      const Icon = typeInfo.icon;
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            selectedIds.has(item.id) ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate max-w-[220px]">
                                  {item.originalFileName || item.fileName}
                                </p>
                                {item.description && (
                                  <p className="text-xs text-slate-500 truncate max-w-[220px]">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {item.contentType || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatFileSize(item.fileSize)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {item.uploadedByName || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handlePreview(item)}
                                title="Preview"
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownload(item)}
                                title="Download"
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCopyLink(item)}
                                title="Copy Link"
                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              >
                                <Link2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(item)}
                                title="Delete"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.goToPage}
              onPageSizeChange={pagination.setPageSize}
            />
          </>
        )}
      </div>

      {/* View / Preview Modal */}
      {viewItem && (
        <Modal
          title={previewUrl ? viewItem.originalFileName || viewItem.fileName : "File Details"}
          onClose={() => { setViewItem(null); setPreviewUrl(null); setPreviewLoading(false); }}
          maxWidth={previewUrl ? "max-w-5xl" : "max-w-lg"}
        >
          <div className="space-y-4">
            {previewUrl ? (
              <>
                {viewItem.contentType?.startsWith("image/") ? (
                  <div className="flex items-center justify-center bg-slate-50 rounded-lg p-2 max-h-[60vh] overflow-auto">
                    <img src={previewUrl} alt={viewItem.originalFileName} className="max-w-full max-h-[55vh] object-contain rounded" />
                  </div>
                ) : viewItem.contentType === "application/pdf" ? (
                  <div className="h-[60vh] rounded-lg overflow-hidden border border-slate-200">
                    <iframe src={previewUrl} title={viewItem.originalFileName} className="w-full h-full" />
                  </div>
                ) : null}
              </>
            ) : previewLoading ? (
              <LoadingSpinner message="Loading preview..." />
            ) : null}

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">File Name</p>
                <p className="font-medium text-slate-800 truncate">{viewItem.originalFileName || viewItem.fileName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Size</p>
                <p className="font-medium text-slate-800">{formatFileSize(viewItem.fileSize)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Type</p>
                <p className="font-medium text-slate-800">{viewItem.contentType || "-"}</p>
              </div>
              {viewItem.uploadedByName && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Uploaded By</p>
                  <p className="font-medium text-slate-800">{viewItem.uploadedByName}</p>
                </div>
              )}
              {viewItem.uploadedAt && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Uploaded At</p>
                  <p className="font-medium text-slate-800">{formatDate(viewItem.uploadedAt)}</p>
                </div>
              )}
            </div>

            {viewItem.description && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Description</p>
                <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{viewItem.description}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDownload(viewItem)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={() => handleCopyLink(viewItem)}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" /> Copy Link
              </button>
              <button
                onClick={() => { setViewItem(null); setPreviewUrl(null); setPreviewLoading(false); }}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete File"
          message={`Are you sure you want to delete "${deleteTarget.originalFileName || deleteTarget.fileName}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
