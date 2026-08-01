import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { getAudits, deleteAudit } from "../../api/audits";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/ui/Pagination";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import SortableHeader from "../../components/ui/SortableHeader";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const columns = [
  { key: "auditCode", label: "Audit Code" },
  { key: "username", label: "Username" },
  { key: "action", label: "Action" },
  { key: "entityName", label: "Entity Name" },
  { key: "entityId", label: "Entity ID" },
  { key: "description", label: "Description" },
  { key: "ipAddress", label: "IP Address" },
  { key: "createdAt", label: "Created At" },
];

const actionColors = {
  CREATE: "bg-emerald-100 text-emerald-800",
  READ: "bg-blue-100 text-blue-800",
  UPDATE: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
};

function Audit() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAudits();
      setData(Array.isArray(result) ? result : result.content || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  const { sortedData, sortConfig, requestSort } = useSortableData(data, "createdAt", "desc");
  const {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    goToPage,
    setPageSize,
  } = usePagination(sortedData);

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteAudit(deleteTargetId);
      toast.success("Audit log deleted successfully.");
      setShowConfirm(false);
      setDeleteTargetId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete audit log.");
    }
  };

  const actionBadge = (action) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionColors[action] || "bg-slate-100 text-slate-700"}`}>
      {action}
    </span>
  );

  if (loading) return <LoadingSpinner message="Loading audit logs..." />;

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((col) => (
                <SortableHeader
                  key={col.key}
                  label={col.label}
                  sortKey={col.key}
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <EmptyState message="No audit logs found." />
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-800">{item.auditCode}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{item.username}</td>
                  <td className="px-4 py-3 text-sm">{actionBadge(item.action)}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{item.entityName}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{item.entityId}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 max-w-[200px] truncate">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{item.ipAddress}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{item.createdAt}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete Audit Log"
          message="Are you sure you want to delete this audit log? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => {
            setShowConfirm(false);
            setDeleteTargetId(null);
          }}
          confirmLabel="Delete"
          danger
        />
      )}
    </div>
  );
}

export default Audit;
