import { useState, useEffect } from "react";
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../../api/prescriptions";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import { inputClass } from "../../components/ui/FormField";
import AppointmentSelect from "../../components/ui/AppointmentSelect";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";

const emptyItem = {
  medicineName: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

const initialFormData = {
  appointmentId: "",
  diagnosis: "",
  advice: "",
  items: [],
};

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await getPrescriptions();
      setPrescriptions(Array.isArray(data) ? data : data.content || []);
    } catch {
      toast.error("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, items: updated };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
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
        await updatePrescription(editId, payload);
        toast.success("Prescription updated successfully.");
      } else {
        await createPrescription(payload);
        toast.success("Prescription created successfully.");
      }
      resetForm();
      fetchPrescriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save prescription.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const rx = await getPrescriptionById(id);
      setFormData({
        appointmentId: rx.appointmentId ?? "",
        diagnosis: rx.diagnosis ?? "",
        advice: rx.advice ?? "",
        items: (rx.items || []).map((item) => ({
          medicineName: item.medicineName ?? "",
          dosage: item.dosage ?? "",
          frequency: item.frequency ?? "",
          duration: item.duration ?? "",
          instructions: item.instructions ?? "",
        })),
      });
      setEditId(id);
      setShowForm(true);
    } catch {
      toast.error("Failed to load prescription details.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePrescription(deleteId);
      toast.success("Prescription deleted successfully.");
      setDeleteId(null);
      fetchPrescriptions();
    } catch {
      toast.error("Failed to delete prescription.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditId(null);
    setShowForm(false);
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(prescriptions, "id", "asc");
  const pagination = usePagination(sortedData, 10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Prescriptions"
        action={
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setFormData({ ...initialFormData, items: [] });
                setShowForm(true);
              }
            }}
            className={
              showForm
                ? "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50"
                : "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
            }
          >
            {showForm ? "Cancel" : "+ New Prescription"}
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editId ? "Edit Prescription" : "New Prescription"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Diagnosis
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Advice
                </label>
                <textarea
                  name="advice"
                  value={formData.advice}
                  onChange={handleChange}
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Medicine List
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  + Add Medicine
                </button>
              </div>

              {formData.items.length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  No medicines added yet. Click "Add Medicine" to begin.
                </p>
              )}

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Medicine #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="medicineName"
                        value={item.medicineName}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Dosage
                      </label>
                      <input
                        type="text"
                        name="dosage"
                        value={item.dosage}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="e.g. 500mg"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Frequency
                      </label>
                      <input
                        type="text"
                        name="frequency"
                        value={item.frequency}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="e.g. Twice daily"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={item.duration}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="e.g. 7 days"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Instructions
                      </label>
                      <input
                        type="text"
                        name="instructions"
                        value={item.instructions}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="e.g. After food"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading prescriptions..." />
        ) : pagination.paginatedData.length === 0 ? (
          <EmptyState message="No prescriptions found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <SortableHeader label="Prescription Code" sortKey="prescriptionCode" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Patient Name" sortKey="patientName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Doctor Name" sortKey="doctorName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Diagnosis" sortKey="diagnosis" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Advice" sortKey="advice" sortConfig={sortConfig} onSort={requestSort} />
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.paginatedData.map((rx) => (
                    <tr key={rx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{rx.prescriptionCode}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{rx.patientName || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{rx.doctorName || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 max-w-[200px] truncate">{rx.diagnosis || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 max-w-[200px] truncate">{rx.advice || "-"}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewItem(rx)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(rx.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(rx.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm"
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
        <Modal title="Prescription Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Prescription Code</p>
              <p className="text-sm text-slate-800 font-medium">{viewItem.prescriptionCode}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
              <p className="text-sm text-slate-800">{viewItem.patientName || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doctor</p>
              <p className="text-sm text-slate-800">{viewItem.doctorName || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.diagnosis || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Advice</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{viewItem.advice || "-"}</p>
            </div>
          </div>

          {viewItem.items && viewItem.items.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Medicine List</h3>
              <div className="space-y-3">
                {viewItem.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 mb-2">Medicine #{idx + 1}</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Name</p>
                        <p className="text-slate-700">{item.medicineName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Dosage</p>
                        <p className="text-slate-700">{item.dosage || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Frequency</p>
                        <p className="text-slate-700">{item.frequency || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Duration</p>
                        <p className="text-slate-700">{item.duration || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Instructions</p>
                        <p className="text-slate-700">{item.instructions || "-"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Prescription"
          message="Are you sure you want to delete this prescription? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
