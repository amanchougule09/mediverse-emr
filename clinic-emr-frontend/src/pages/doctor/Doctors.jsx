import { useState, useEffect } from "react";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../api/doctors";
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

const emptyForm = {
  firstName: "",
  lastName: "",
  specialization: "",
  mobile: "",
  email: "",
  qualification: "",
  experience: "",
  gender: "",
  address: "",
};

const genderOptions = ["Male", "Female", "Other"];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { sortedData, sortConfig, requestSort } = useSortableData(doctors, "id", "asc");
  const { paginatedData, currentPage, totalPages, pageSize, totalItems, goToPage, setPageSize } = usePagination(sortedData);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      toast.error("Failed to load doctors: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditId(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  const handleEdit = async (id) => {
    try {
      const doctor = await getDoctorById(id);
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        specialization: doctor.specialization || "",
        mobile: doctor.mobile || "",
        email: doctor.email || "",
        qualification: doctor.qualification || "",
        experience: doctor.experience || "",
        gender: doctor.gender || "",
        address: doctor.address || "",
      });
      setEditId(id);
      setShowForm(true);
    } catch (err) {
      toast.error("Failed to load doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoctor(deleteTarget.id);
      toast.success("Doctor deactivated successfully");
      setDeleteTarget(null);
      loadDoctors();
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await updateDoctor(editId, formData);
        toast.success("Doctor updated successfully");
      } else {
        await createDoctor(formData);
        toast.success("Doctor created successfully");
      }
      setShowForm(false);
      setFormData({ ...emptyForm });
      setEditId(null);
      loadDoctors();
    } catch (err) {
      toast.error("Save failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ ...emptyForm });
    setEditId(null);
  };

  const inputClass = "w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader title="Doctors" actionLabel="+ Add Doctor" onAction={handleAdd} />

      {showForm && (
        <Modal title={editId ? "Edit Doctor" : "Add Doctor"} onClose={handleCancel} maxWidth="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Specialization *</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Mobile *</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Qualification</label>
                <input name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Experience (years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className={inputClass} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={handleCancel} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {submitting && <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {viewItem && (
        <Modal title="Doctor Details" onClose={() => setViewItem(null)} maxWidth="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Doctor Code</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.doctorCode || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">First Name</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.firstName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Name</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.lastName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Specialization</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.specialization || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Gender</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.gender || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewItem.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {viewItem.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.mobile || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.email || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.address || "-"}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Qualification</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.qualification || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Experience (years)</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.experience || "-"}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setViewItem(null)} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Deactivate Doctor"
          message={`Are you sure you want to deactivate doctor "${deleteTarget.firstName} ${deleteTarget.lastName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Deactivate"
          danger
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading doctors..." />
        ) : doctors.length === 0 ? (
          <EmptyState message="No doctors found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <SortableHeader label="Doctor Code" sortKey="doctorCode" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="First Name" sortKey="firstName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Last Name" sortKey="lastName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Specialization" sortKey="specialization" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Mobile" sortKey="mobile" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Email" sortKey="email" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Active" sortKey="active" sortConfig={sortConfig} onSort={requestSort} />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{d.doctorCode}</td>
                      <td className="px-4 py-3 text-slate-600">{d.firstName}</td>
                      <td className="px-4 py-3 text-slate-600">{d.lastName}</td>
                      <td className="px-4 py-3 text-slate-600">{d.specialization}</td>
                      <td className="px-4 py-3 text-slate-600">{d.mobile}</td>
                      <td className="px-4 py-3 text-slate-600">{d.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${d.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                          {d.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setViewItem(d)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1 rounded text-sm transition-colors">
                          View
                        </button>
                        <button onClick={() => handleEdit(d.id)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors">
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(d)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
    </div>
  );
}
