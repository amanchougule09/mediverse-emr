import { useState, useEffect } from "react";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../api/appointments";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import EntitySelect from "../../components/ui/EntitySelect";
import { inputClass, textareaClass } from "../../components/ui/FormField";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";

const initialFormData = {
  patientId: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
  notes: "",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : data.content || []);
    } catch {
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId) {
      toast.error("Please select both patient and doctor.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        patientId: Number(formData.patientId),
        doctorId: Number(formData.doctorId),
      };
      if (editId) {
        await updateAppointment(editId, payload);
        toast.success("Appointment updated successfully.");
      } else {
        await createAppointment(payload);
        toast.success("Appointment created successfully.");
      }
      resetForm();
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const appt = await getAppointmentById(id);
      setFormData({
        patientId: appt.patientId ?? appt.patient?.id ?? "",
        doctorId: appt.doctorId ?? appt.doctor?.id ?? "",
        appointmentDate: appt.appointmentDate ?? "",
        appointmentTime: appt.appointmentTime ?? "",
        reason: appt.reason ?? "",
        notes: appt.notes ?? "",
      });
      setEditId(id);
      setShowForm(true);
    } catch {
      toast.error("Failed to load appointment details.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAppointment(deleteId);
      toast.success("Appointment deleted successfully.");
      setDeleteId(null);
      fetchAppointments();
    } catch {
      toast.error("Failed to delete appointment.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditId(null);
    setShowForm(false);
  };

  const filtered = appointments.filter((a) => {
    if (dateFrom && a.appointmentDate < dateFrom) return false;
    if (dateTo && a.appointmentDate > dateTo) return false;
    return true;
  });

  const { sortedData, sortConfig, requestSort } = useSortableData(filtered, "id", "asc");
  const pagination = usePagination(sortedData, 10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Appointments"
        action={
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className={
              showForm
                ? "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50"
                : "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
            }
          >
            {showForm ? "Cancel" : "+ New Appointment"}
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editId ? "Edit Appointment" : "New Appointment"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Patient *
                </label>
                <EntitySelect
                  type="patient"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Doctor *
                </label>
                <EntitySelect
                  type="doctor"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Time *
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Reason
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading appointments..." />
        ) : pagination.paginatedData.length === 0 ? (
          <EmptyState message="No appointments found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                    <SortableHeader label="Code" sortKey="appointmentCode" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Patient" sortKey="patientName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Doctor" sortKey="doctorName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Date" sortKey="appointmentDate" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Time" sortKey="appointmentTime" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Reason" sortKey="reason" sortConfig={sortConfig} onSort={requestSort} />
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.paginatedData.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{appt.appointmentCode}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{appt.patientName || appt.patient?.name || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{appt.doctorName || appt.doctor?.name || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{appt.appointmentDate}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{appt.appointmentTime}</td>
                      <td className="px-4 py-4"><StatusBadge status={appt.status} /></td>
                      <td className="px-4 py-4 text-sm text-slate-600 max-w-[200px] truncate">{appt.reason || "-"}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewItem(appt)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(appt.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(appt.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
        <Modal title="Appointment Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Appointment Code</p>
              <p className="text-sm text-slate-800 font-medium">{viewItem.appointmentCode}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={viewItem.status} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
              <p className="text-sm text-slate-800">{viewItem.patientName || viewItem.patient?.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doctor</p>
              <p className="text-sm text-slate-800">{viewItem.doctorName || viewItem.doctor?.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</p>
              <p className="text-sm text-slate-800">{viewItem.appointmentDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Time</p>
              <p className="text-sm text-slate-800">{viewItem.appointmentTime}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reason</p>
              <p className="text-sm text-slate-800">{viewItem.reason || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.notes || "-"}</p>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Appointment"
          message="Are you sure you want to delete this appointment? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
