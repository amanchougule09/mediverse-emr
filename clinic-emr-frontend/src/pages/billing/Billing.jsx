import { useState, useEffect } from "react";
import {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
} from "../../api/billing";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import EntitySelect from "../../components/ui/EntitySelect";
import FormField, { inputClass, selectClass } from "../../components/ui/FormField";
import AppointmentSelect from "../../components/ui/AppointmentSelect";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import toast from "react-hot-toast";

const initialFormData = {
  patientId: "",
  appointmentId: "",
  consultationFee: "",
  medicineAmount: "",
  laboratoryAmount: "",
  discount: "",
  paymentStatus: "PENDING",
  paymentMethod: "NONE",
};

const paymentStatusOptions = ["PENDING", "PAID", "PARTIAL", "CANCELLED"];
const paymentMethodOptions = ["CASH", "CARD", "UPI", "BANK_TRANSFER", "NONE"];

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadBills = async () => {
    setLoading(true);
    try {
      const data = await getBills();
      setBills(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
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
    if (!formData.patientId) {
      toast.error("Please select a patient");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        patientId: Number(formData.patientId),
        appointmentId: formData.appointmentId
          ? Number(formData.appointmentId)
          : null,
        consultationFee: formData.consultationFee
          ? Number(formData.consultationFee)
          : 0,
        medicineAmount: formData.medicineAmount
          ? Number(formData.medicineAmount)
          : 0,
        laboratoryAmount: formData.laboratoryAmount
          ? Number(formData.laboratoryAmount)
          : 0,
        discount: formData.discount ? Number(formData.discount) : 0,
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMethod,
      };

      if (editId) {
        await updateBill(editId, payload);
        toast.success("Bill updated successfully");
      } else {
        await createBill(payload);
        toast.success("Bill created successfully");
      }
      resetForm();
      await loadBills();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `Failed to ${editId ? "update" : "create"} bill`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const bill = await getBillById(id);
      setFormData({
        patientId: bill.patientId || "",
        appointmentId: bill.appointmentId || "",
        consultationFee: bill.consultationFee || "",
        medicineAmount: bill.medicineAmount || "",
        laboratoryAmount: bill.laboratoryAmount || "",
        discount: bill.discount || "",
        paymentStatus: bill.paymentStatus || "PENDING",
        paymentMethod: bill.paymentMethod || "NONE",
      });
      setEditId(id);
      setShowForm(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load bill");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBill(deleteTarget.id);
      toast.success("Bill deleted successfully");
      setDeleteTarget(null);
      await loadBills();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete bill");
      setDeleteTarget(null);
    }
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(bills);
  const pagination = usePagination(sortedData);

  const formatCurrency = (amount) => {
    if (amount == null) return "-";
    return `\u20B9${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Billing Management"
        actionLabel="+ New Bill"
        onAction={() => {
          resetForm();
          setShowForm(true);
        }}
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editId ? "Edit Bill" : "Create New Bill"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <FormField label="Patient" required>
                <EntitySelect
                  type="patient"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </FormField>
              <FormField label="Appointment">
                <AppointmentSelect
                  value={formData.appointmentId}
                  onChange={handleChange}
                />
              </FormField>
              <FormField label="Consultation Fee">
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Medicine Amount">
                <input
                  type="number"
                  name="medicineAmount"
                  value={formData.medicineAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Laboratory Amount">
                <input
                  type="number"
                  name="laboratoryAmount"
                  value={formData.laboratoryAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Discount">
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Payment Status">
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {paymentStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Payment Method">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {paymentMethodOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </FormField>
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editId ? "Update Bill" : "Create Bill"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700">
            Bills ({pagination.totalItems})
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading bills..." />
        ) : bills.length === 0 ? (
          <EmptyState message="No bills found. Create a new bill to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <SortableHeader
                      label="Bill Number"
                      sortKey="billNumber"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Patient Name"
                      sortKey="patientName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Total Amount"
                      sortKey="totalAmount"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3 text-right"
                    />
                    <SortableHeader
                      label="Payment Status"
                      sortKey="paymentStatus"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <SortableHeader
                      label="Payment Method"
                      sortKey="paymentMethod"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="px-6 py-3"
                    />
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.paginatedData.map((bill) => (
                    <tr
                      key={bill.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {bill.billNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {bill.patientName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">
                        {formatCurrency(bill.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={bill.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {bill.paymentMethod?.replace("_", " ") || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewItem(bill)}
                            className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded text-sm transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(bill.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(bill)}
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
        <Modal title="Bill Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Bill Number
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.billNumber || "-"}
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
                Total Amount
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatCurrency(viewItem.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Consultation Fee
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatCurrency(viewItem.consultationFee)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Medicine Amount
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatCurrency(viewItem.medicineAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Laboratory Amount
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatCurrency(viewItem.laboratoryAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Discount
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {formatCurrency(viewItem.discount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Payment Status
              </p>
              <div className="mt-1">
                <StatusBadge status={viewItem.paymentStatus} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Payment Method
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.paymentMethod?.replace("_", " ") || "-"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Bill"
          message={`Are you sure you want to delete bill ${deleteTarget.billNumber || deleteTarget.id}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
