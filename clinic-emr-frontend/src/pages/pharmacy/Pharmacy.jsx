import { useState, useEffect } from "react";
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../api/pharmacy";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import FormField, { inputClass, selectClass } from "../../components/ui/FormField";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";

const initialFormData = {
  medicineName: "",
  manufacturer: "",
  category: "",
  batchNumber: "",
  expiryDate: "",
  quantity: "",
  unitPrice: "",
  supplierName: "",
  status: "IN_STOCK",
};

const statusOptions = ["IN_STOCK", "OUT_OF_STOCK", "EXPIRED", "DISCONTINUED"];

export default function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await getMedicines();
      setMedicines(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        medicineName: formData.medicineName,
        manufacturer: formData.manufacturer,
        category: formData.category,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate || null,
        quantity: formData.quantity ? Number(formData.quantity) : 0,
        unitPrice: formData.unitPrice ? Number(formData.unitPrice) : 0,
        supplierName: formData.supplierName,
        status: formData.status,
      };

      if (editId) {
        await updateMedicine(editId, payload);
        toast.success("Medicine updated successfully");
      } else {
        await createMedicine(payload);
        toast.success("Medicine created successfully");
      }
      resetForm();
      await loadMedicines();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `Failed to ${editId ? "update" : "create"} medicine`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const med = await getMedicineById(id);
      setFormData({
        medicineName: med.medicineName || "",
        manufacturer: med.manufacturer || "",
        category: med.category || "",
        batchNumber: med.batchNumber || "",
        expiryDate: med.expiryDate ? med.expiryDate.substring(0, 10) : "",
        quantity: med.quantity ?? "",
        unitPrice: med.unitPrice ?? "",
        supplierName: med.supplierName || "",
        status: med.status || "IN_STOCK",
      });
      setEditId(id);
      setShowForm(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load medicine");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMedicine(deleteTarget.id);
      toast.success("Medicine deleted successfully");
      setDeleteTarget(null);
      await loadMedicines();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete medicine");
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(medicines);
  const pagination = usePagination(sortedData);

  const formatCurrency = (amount) => {
    if (amount == null) return "-";
    return `\u20B9${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <PageHeader
        title="Pharmacy Management"
        actionLabel="+ New Medicine"
        onAction={() => {
          resetForm();
          setShowForm(true);
        }}
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editId ? "Edit Medicine" : "Add New Medicine"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Medicine Name">
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Manufacturer">
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Category">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Batch Number">
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Expiry Date">
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Quantity">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Unit Price">
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Supplier Name">
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editId ? "Update Medicine" : "Add Medicine"}
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
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Medicines ({pagination.totalItems})
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading medicines..." />
        ) : medicines.length === 0 ? (
          <EmptyState message="No medicines found. Add a new medicine to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <SortableHeader
                      label="Medicine Code"
                      sortKey="medicineCode"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Medicine Name"
                      sortKey="medicineName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Manufacturer"
                      sortKey="manufacturer"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Category"
                      sortKey="category"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Quantity"
                      sortKey="quantity"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3 text-right"
                    />
                    <SortableHeader
                      label="Unit Price"
                      sortKey="unitPrice"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3 text-right"
                    />
                    <SortableHeader
                      label="Status"
                      sortKey="status"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Expiry Date"
                      sortKey="expiryDate"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.paginatedData.map((med) => (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {med.medicineCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.medicineName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.manufacturer || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {med.category || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-slate-800">
                        {med.quantity ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-slate-800">
                        {formatCurrency(med.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge status={med.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDate(med.expiryDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewItem(med)}
                            className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded text-sm transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(med.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(med)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors"
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
        <Modal title="Medicine Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Medicine Code
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.medicineCode || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Medicine Name
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.medicineName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Manufacturer
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.manufacturer || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Category
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.category || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Batch Number
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.batchNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Expiry Date
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatDate(viewItem.expiryDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Quantity
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.quantity ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Unit Price
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatCurrency(viewItem.unitPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Supplier Name
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.supplierName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={viewItem.status} />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Medicine"
          message={`Are you sure you want to delete medicine ${deleteTarget.medicineName || deleteTarget.id}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
