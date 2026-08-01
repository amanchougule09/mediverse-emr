import { useEffect, useState } from "react";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../../api/notifications";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import EntitySelect from "../../components/ui/EntitySelect";
import FormField, {
  inputClass,
  selectClass,
  textareaClass,
} from "../../components/ui/FormField";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";

const initialForm = {
  patientId: "",
  doctorId: "",
  title: "",
  message: "",
  notificationType: "GENERAL",
  notificationStatus: "PENDING",
};

const typeOptions = ["APPOINTMENT", "REMINDER", "FOLLOW_UP", "BILLING", "GENERAL"];
const statusOptions = ["PENDING", "SENT", "READ", "FAILED"];

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setData(Array.isArray(res) ? res : res.content || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId && !form.doctorId) {
      toast.error("Please select at least one recipient (patient or doctor)");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        patientId: form.patientId ? Number(form.patientId) : null,
        doctorId: form.doctorId ? Number(form.doctorId) : null,
      };
      if (editingId) {
        await updateNotification(editingId, payload);
        toast.success("Notification updated successfully");
      } else {
        await createNotification(payload);
        toast.success("Notification created successfully");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `Failed to ${editingId ? "update" : "create"} notification`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const item = await getNotificationById(id);
      setForm({
        patientId: item.patientId || "",
        doctorId: item.doctorId || "",
        title: item.title || "",
        message: item.message || "",
        notificationType: item.notificationType || "GENERAL",
        notificationStatus: item.notificationStatus || "PENDING",
      });
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load notification details."
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNotification(deleteTarget.id);
      toast.success("Notification deleted successfully");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete notification."
      );
      setDeleteTarget(null);
    }
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(data);
  const pagination = usePagination(sortedData);

  if (loading) {
    return <LoadingSpinner message="Loading Notifications..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        actionLabel="+ Add Notification"
        onAction={() => {
          resetForm();
          setShowForm(true);
        }}
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editingId ? "Edit Notification" : "Add Notification"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <FormField label="Patient">
              <EntitySelect
                type="patient"
                value={form.patientId}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Doctor">
              <EntitySelect
                type="doctor"
                value={form.doctorId}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Title" required>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>
            <div className="md:col-span-3">
              <FormField label="Message" required>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  required
                  className={textareaClass}
                />
              </FormField>
            </div>
            <FormField label="Type">
              <select
                name="notificationType"
                value={form.notificationType}
                onChange={handleChange}
                className={selectClass}
              >
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                name="notificationStatus"
                value={form.notificationStatus}
                onChange={handleChange}
                className={selectClass}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {data.length === 0 && !loading ? (
          <EmptyState message="No notifications found. Add a new notification to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <SortableHeader
                      label="Notification Code"
                      sortKey="notificationCode"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Title"
                      sortKey="title"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Patient Name"
                      sortKey="patientName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Doctor Name"
                      sortKey="doctorName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Type"
                      sortKey="notificationType"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Status"
                      sortKey="notificationStatus"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Sent At"
                      sortKey="sentAt"
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
                      <td
                        colSpan={8}
                        className="px-4 py-12 text-center text-slate-500 text-sm"
                      >
                        No notifications found.
                      </td>
                    </tr>
                  ) : (
                    pagination.paginatedData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.notificationCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.patientName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.doctorName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={item.notificationType} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={item.notificationStatus} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.sentAt}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setViewItem(item)}
                              className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded text-sm transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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

      {viewItem && (
        <Modal title="Notification Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Notification Code
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.notificationCode || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Title
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.title || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Patient Name
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.patientName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Doctor Name
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.doctorName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Type
              </p>
              <div className="mt-1">
                <StatusBadge status={viewItem.notificationType} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={viewItem.notificationStatus} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Sent At
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.sentAt || "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Message
              </p>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">
                {viewItem.message || "-"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Notification"
          message={`Are you sure you want to delete notification ${deleteTarget.notificationCode || deleteTarget.id}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
