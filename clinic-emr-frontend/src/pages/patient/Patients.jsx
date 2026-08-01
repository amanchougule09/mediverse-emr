import { useState, useEffect } from "react";
import {
  getPatients,
  getPatientById,
  searchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../../api/patients";
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
  middleName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  maritalStatus: "",
  occupation: "",
  aadhaarNumber: "",
  insuranceNumber: "",
  height: "",
  weight: "",
  allergies: "",
  chronicDiseases: "",
};

const genderOptions = ["Male", "Female", "Other"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { sortedData, sortConfig, requestSort } = useSortableData(patients, "id", "asc");
  const { paginatedData, currentPage, totalPages, pageSize, totalItems, goToPage, setPageSize } = usePagination(sortedData);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      toast.error("Failed to load patients: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadPatients();
      return;
    }
    setLoading(true);
    try {
      const data = await searchPatients(searchKeyword);
      setPatients(data);
    } catch (err) {
      toast.error("Search failed: " + (err.response?.data?.message || err.message));
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
      const patient = await getPatientById(id);
      setFormData({
        firstName: patient.firstName || "",
        middleName: patient.middleName || "",
        lastName: patient.lastName || "",
        gender: patient.gender || "",
        dateOfBirth: patient.dateOfBirth || "",
        bloodGroup: patient.bloodGroup || "",
        mobile: patient.mobile || "",
        email: patient.email || "",
        address: patient.address || "",
        city: patient.city || "",
        state: patient.state || "",
        country: patient.country || "",
        pincode: patient.pincode || "",
        emergencyContactName: patient.emergencyContactName || "",
        emergencyContactNumber: patient.emergencyContactNumber || "",
        maritalStatus: patient.maritalStatus || "",
        occupation: patient.occupation || "",
        aadhaarNumber: patient.aadhaarNumber || "",
        insuranceNumber: patient.insuranceNumber || "",
        height: patient.height || "",
        weight: patient.weight || "",
        allergies: patient.allergies || "",
        chronicDiseases: patient.chronicDiseases || "",
      });
      setEditId(id);
      setShowForm(true);
    } catch (err) {
      toast.error("Failed to load patient: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePatient(deleteTarget.id);
      toast.success("Patient deactivated successfully");
      setDeleteTarget(null);
      loadPatients();
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await updatePatient(editId, formData);
        toast.success("Patient updated successfully");
      } else {
        await createPatient(formData);
        toast.success("Patient created successfully");
      }
      setShowForm(false);
      setFormData({ ...emptyForm });
      setEditId(null);
      loadPatients();
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
      <PageHeader title="Patients" actionLabel="+ Add Patient" onAction={handleAdd} />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20">
          Search
        </button>
        {searchKeyword && (
          <button onClick={() => { setSearchKeyword(""); loadPatients(); }} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            Clear
          </button>
        )}
      </div>

      {showForm && (
        <Modal title={editId ? "Edit Patient" : "Add Patient"} onClose={handleCancel} maxWidth="max-w-3xl">
          <form onSubmit={handleSubmit}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Middle Name</label>
                <input name="middleName" value={formData.middleName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className={inputClass}>
                  <option value="">Select</option>
                  {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  {bloodGroupOptions.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  {maritalStatusOptions.map((ms) => <option key={ms} value={ms}>{ms}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Occupation</label>
                <input name="occupation" value={formData.occupation} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className={labelClass}>Mobile *</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input name="city" value={formData.city} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input name="state" value={formData.state} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input name="country" value={formData.country} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className={labelClass}>Contact Name</label>
                <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Identification & Insurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className={labelClass}>Aadhaar Number</label>
                <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Insurance Number</label>
                <input name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className={labelClass}>Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows={2} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Chronic Diseases</label>
                <textarea name="chronicDiseases" value={formData.chronicDiseases} onChange={handleChange} rows={2} className={inputClass} />
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
        <Modal title="Patient Details" onClose={() => setViewItem(null)} maxWidth="max-w-3xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Patient Code</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.patientCode || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">First Name</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.firstName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Middle Name</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.middleName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Name</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.lastName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Gender</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.gender || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date of Birth</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.dateOfBirth || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Blood Group</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.bloodGroup || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Marital Status</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.maritalStatus || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Occupation</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.occupation || "-"}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.mobile || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.email || "-"}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.address || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">City</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.city || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">State</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.state || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Country</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.country || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pincode</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.pincode || "-"}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Contact Name</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.emergencyContactName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Contact Number</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.emergencyContactNumber || "-"}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Identification & Insurance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Aadhaar Number</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.aadhaarNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Insurance Number</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.insuranceNumber || "-"}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Height (cm)</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.height || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Weight (kg)</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.weight || "-"}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-xs text-slate-500">Allergies</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.allergies || "-"}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-xs text-slate-500">Chronic Diseases</p>
                  <p className="text-sm font-medium text-slate-800">{viewItem.chronicDiseases || "-"}</p>
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
          title="Deactivate Patient"
          message={`Are you sure you want to deactivate patient "${deleteTarget.fullName || deleteTarget.firstName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Deactivate"
          danger
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading patients..." />
        ) : patients.length === 0 ? (
          <EmptyState message="No patients found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <SortableHeader label="Patient Code" sortKey="patientCode" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Full Name" sortKey="fullName" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Gender" sortKey="gender" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Mobile" sortKey="mobile" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Email" sortKey="email" sortConfig={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Active" sortKey="active" sortConfig={sortConfig} onSort={requestSort} />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{p.patientCode}</td>
                      <td className="px-4 py-3 text-slate-600">{p.fullName}</td>
                      <td className="px-4 py-3 text-slate-600">{p.gender}</td>
                      <td className="px-4 py-3 text-slate-600">{p.mobile}</td>
                      <td className="px-4 py-3 text-slate-600">{p.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setViewItem(p)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1 rounded text-sm transition-colors">
                          View
                        </button>
                        <button onClick={() => handleEdit(p.id)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors">
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors">
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
