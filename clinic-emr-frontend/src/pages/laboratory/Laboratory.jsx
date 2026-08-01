import { useEffect, useState } from "react";
import {
  getLabTests,
  getLabTestById,
  createLabTest,
  updateLabTest,
  deleteLabTest,
} from "../../api/laboratory";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import Pagination from "../../components/ui/Pagination";
import EntitySelect from "../../components/ui/EntitySelect";
import AppointmentSelect from "../../components/ui/AppointmentSelect";
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
  appointmentId: "",
  testName: "",
  sampleType: "",
  testStatus: "PENDING",
  result: "",
  remarks: "",
  testDate: "",
};

const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function Laboratory() {
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
      const res = await getLabTests();
      setData(Array.isArray(res) ? res : res.content || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load lab tests.");
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
    if (!form.patientId) {
      toast.error("Please select a patient");
      return;
    }
    if (!form.doctorId) {
      toast.error("Please select a doctor");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        appointmentId: form.appointmentId ? Number(form.appointmentId) : null,
      };
      if (editingId) {
        await updateLabTest(editingId, payload);
        toast.success("Lab test updated successfully");
      } else {
        await createLabTest(payload);
        toast.success("Lab test created successfully");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `Failed to ${editingId ? "update" : "create"} lab test`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const item = await getLabTestById(id);
      setForm({
        patientId: item.patientId || "",
        doctorId: item.doctorId || "",
        appointmentId: item.appointmentId || "",
        testName: item.testName || "",
        sampleType: item.sampleType || "",
        testStatus: item.testStatus || "PENDING",
        result: item.result || "",
        remarks: item.remarks || "",
        testDate: item.testDate || "",
      });
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load lab test details.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLabTest(deleteTarget.id);
      toast.success("Lab test deleted successfully");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lab test.");
      setDeleteTarget(null);
    }
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(data);
  const pagination = usePagination(sortedData);

  if (loading) {
    return <LoadingSpinner message="Loading Lab Tests..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laboratory"
        actionLabel="+ Add Lab Test"
        onAction={() => {
          resetForm();
          setShowForm(true);
        }}
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editingId ? "Edit Lab Test" : "Add Lab Test"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <FormField label="Patient" required>
              <EntitySelect
                type="patient"
                value={form.patientId}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField label="Doctor" required>
              <EntitySelect
                type="doctor"
                value={form.doctorId}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField label="Appointment">
              <AppointmentSelect
                value={form.appointmentId}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Test Name" required>
              <input
                type="text"
                name="testName"
                value={form.testName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>
            <FormField label="Sample Type" required>
              <input
                type="text"
                name="sampleType"
                value={form.sampleType}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>
            <FormField label="Status">
              <select
                name="testStatus"
                value={form.testStatus}
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
            <FormField label="Test Date" required>
              <input
                type="date"
                name="testDate"
                value={form.testDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Result">
                <textarea
                  name="result"
                  value={form.result}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </FormField>
            </div>
            <div className="md:col-span-3">
              <FormField label="Remarks">
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </FormField>
            </div>
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
          <EmptyState message="No lab tests found. Add a new lab test to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <SortableHeader
                      label="Test Code"
                      sortKey="testCode"
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
                      label="Test Name"
                      sortKey="testName"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Sample Type"
                      sortKey="sampleType"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Status"
                      sortKey="testStatus"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Result"
                      sortKey="result"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                    />
                    <SortableHeader
                      label="Test Date"
                      sortKey="testDate"
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
                        colSpan={9}
                        className="px-4 py-12 text-center text-slate-500 text-sm"
                      >
                        No lab tests found.
                      </td>
                    </tr>
                  ) : (
                    pagination.paginatedData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.testCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.patientName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.doctorName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.testName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.sampleType}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={item.testStatus} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800 max-w-[200px] truncate">
                          {item.result}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {item.testDate}
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
        <Modal title="Lab Test Details" onClose={() => setViewItem(null)}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Test Code
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.testCode || "-"}
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
                Test Name
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.testName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Sample Type
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.sampleType || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={viewItem.testStatus} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Test Date
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {viewItem.testDate || "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Result
              </p>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">
                {viewItem.result || "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Remarks
              </p>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">
                {viewItem.remarks || "-"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Lab Test"
          message={`Are you sure you want to delete lab test ${deleteTarget.testCode || deleteTarget.id}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
