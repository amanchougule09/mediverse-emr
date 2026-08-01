import { useState, useEffect } from "react";
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from "../../api/consultations";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import { inputClass, selectClass, textareaClass } from "../../components/ui/FormField";
import AppointmentSelect from "../../components/ui/AppointmentSelect";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";

const initialFormData = {
  appointmentId: "",
  symptoms: "",
  diagnosis: "",
  examination: "",
  doctorNotes: "",
  followUpDate: "",
  status: "SCHEDULED",
};

const statusOptions = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const data = await getConsultations();
      setConsultations(Array.isArray(data) ? data : data.content || []);
    } catch {
      toast.error("Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appointmentId) {
      toast.error("Please select an appointment.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        appointmentId: Number(formData.appointmentId),
      };
      if (editId) {
        await updateConsultation(editId, payload);
        toast.success("Consultation updated successfully.");
      } else {
        await createConsultation(payload);
        toast.success("Consultation created successfully.");
      }
      resetForm();
      fetchConsultations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save consultation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const c = await getConsultationById(id);
      setFormData({
        appointmentId: c.appointmentId ?? c.appointment?.id ?? "",
        symptoms: c.symptoms ?? "",
        diagnosis: c.diagnosis ?? "",
        examination: c.examination ?? "",
        doctorNotes: c.doctorNotes ?? "",
        followUpDate: c.followUpDate ?? "",
        status: c.status || "SCHEDULED",
      });
      setEditId(id);
      setShowForm(true);
    } catch {
      toast.error("Failed to load consultation details.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteConsultation(deleteId);
      toast.success("Consultation deleted successfully.");
      setDeleteId(null);
      fetchConsultations();
    } catch {
      toast.error("Failed to delete consultation.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditId(null);
    setShowForm(false);
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(consultations, "id", "asc");
  const pagination = usePagination(sortedData, 10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Consultations"
        action={
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className={
              showForm
                ? "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50"
                : "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
            }
          >
            {showForm ? "Cancel" : "+ New Consultation"}
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editId ? "Edit Consultation" : "New Consultation"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Appointment *
                </label>
                <AppointmentSelect
                  value={formData.appointmentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Symptoms
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Examination
                </label>
                <textarea
                  name="examination"
                  value={formData.examination}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Doctor Notes
                </label>
                <textarea
                  name="doctorNotes"
                  value={formData.doctorNotes}
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
        {loading ? (
          <LoadingSpinner message="Loading consultations..." />
        ) : pagination.paginatedData.length === 0 ? (
          <EmptyState message="No consultations found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                    <SortableHeader label="Code" sortKey="consultationCode" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Patient" sortKey="patientName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Doctor" sortKey="doctorName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Diagnosis" sortKey="diagnosis" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Follow-up Date" sortKey="followUpDate" sortConfig={sortConfig} onSort={requestSort} />
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.paginatedData.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{c.consultationCode}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{c.patientName || c.patient?.name || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{c.doctorName || c.doctor?.name || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 max-w-[200px] truncate">{c.diagnosis || "-"}</td>
                      <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-4 text-sm text-slate-600">{c.followUpDate || "-"}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewItem(c)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(c.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(c.id)}
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
        <Modal title="Consultation Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Consultation Code</p>
              <p className="text-sm text-slate-800 font-medium">{viewItem.consultationCode}</p>
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
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.diagnosis || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Symptoms</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.symptoms || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Examination</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.examination || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doctor Notes</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.doctorNotes || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Follow-up Date</p>
              <p className="text-sm text-slate-800">{viewItem.followUpDate || "-"}</p>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Consultation"
          message="Are you sure you want to delete this consultation? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
