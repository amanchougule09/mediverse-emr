import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { UserCog } from "lucide-react";
import { getUsers, updateUserRoles } from "../../api/users";
import { getRoles } from "../../api/roles";
import { useAuth } from "../../auth/AuthContext";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import useSortableData from "../../hooks/useSortableData";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/ui/Pagination";
import SortableHeader from "../../components/ui/SortableHeader";

function formatRoleName(name) {
    return name.replace("ROLE_", "").replace(/_/g, " ");
}

function Users() {
    const { hasPermission } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [roleTarget, setRoleTarget] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const canManage = hasPermission("user:manage");

    const { sortedData, sortConfig, requestSort } = useSortableData(users, "username", "asc");
    const { paginatedData, currentPage, totalPages, pageSize, totalItems, goToPage, setPageSize } =
        usePagination(sortedData);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenRoles = (user) => {
        setRoleTarget(user);
        setSelectedRoles([...user.roles]);
    };

    const toggleRole = (name) => {
        setSelectedRoles((prev) =>
            prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
        );
    };

    const handleSaveRoles = async () => {
        if (!roleTarget) return;
        setSubmitting(true);
        try {
            const roleIds = roles
                .filter((role) => selectedRoles.includes(role.name))
                .map((role) => role.id);
            await updateUserRoles(roleTarget.id, roleIds);
            toast.success("User roles updated successfully");
            setRoleTarget(null);
            await loadData();
        } catch (err) {
            toast.error("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="User Management" />

            {roleTarget && (
                <Modal
                    title={`Roles - ${roleTarget.username}`}
                    onClose={() => setRoleTarget(null)}
                    maxWidth="max-w-md"
                >
                    <div className="space-y-6">
                        <p className="text-sm text-slate-500">
                            Assign roles to <span className="font-medium text-slate-700">{roleTarget.username}</span>.
                            The user's access is the union of all selected role permissions.
                        </p>
                        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.name)}
                                        onChange={() => toggleRole(role.name)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{formatRoleName(role.name)}</p>
                                        <p className="text-xs text-slate-400">{role.description || ""}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => setRoleTarget(null)}
                                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRoles}
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting && <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                Save Roles
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="Loading users..." />
                ) : users.length === 0 ? (
                    <EmptyState message="No users found." />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-600">
                                        <SortableHeader label="Username" sortKey="username" sortConfig={sortConfig} onSort={requestSort} />
                                        <SortableHeader label="Name" sortKey="firstName" sortConfig={sortConfig} onSort={requestSort} />
                                        <SortableHeader label="Email" sortKey="email" sortConfig={sortConfig} onSort={requestSort} />
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Roles</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedData.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-800">{user.username}</td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length === 0 ? (
                                                        <span className="text-xs text-slate-400 italic">No role assigned</span>
                                                    ) : (
                                                        user.roles.map((role) => (
                                                            <span
                                                                key={role}
                                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                            >
                                                                {formatRoleName(role)}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.enabled ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                                    {user.enabled ? "Active" : "Disabled"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {canManage ? (
                                                    <button
                                                        onClick={() => handleOpenRoles(user)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <UserCog className="w-3.5 h-3.5" /> Roles
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Read-only</span>
                                                )}
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

export default Users;
