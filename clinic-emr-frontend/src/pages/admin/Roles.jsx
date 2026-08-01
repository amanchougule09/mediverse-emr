import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Shield, ShieldCheck, Trash2, PenSquare } from "lucide-react";
import { getRoles, createRole, updateRole, updateRolePermissions, deleteRole } from "../../api/roles";
import { getPermissions } from "../../api/permissions";
import { useAuth } from "../../auth/AuthContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

const emptyForm = { name: "", description: "" };

function formatRoleName(name) {
    return name.replace("ROLE_", "").replace(/_/g, " ");
}

function groupPermissions(permissions) {
    const groups = {};
    permissions.forEach((permission) => {
        const module = permission.name.split(":")[0];
        if (!groups[module]) groups[module] = [];
        groups[module].push(permission);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

function Roles() {
    const { hasPermission } = useAuth();
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [showPermissionEditor, setShowPermissionEditor] = useState(false);
    const [permissionTarget, setPermissionTarget] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const canManage = hasPermission("role:manage");

    const loadData = async () => {
        try {
            setLoading(true);
            const [rolesData, permissionsData] = await Promise.all([getRoles(), getPermissions()]);
            setRoles(rolesData);
            setPermissions(permissionsData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load roles: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const permissionGroups = useMemo(() => groupPermissions(permissions), [permissions]);

    const handleAdd = () => {
        setEditId(null);
        setFormData({ ...emptyForm });
        setShowForm(true);
    };

    const handleEdit = (role) => {
        setEditId(role.id);
        setFormData({ name: role.name, description: role.description || "" });
        setShowForm(true);
    };

    const handleOpenPermissions = (role) => {
        setPermissionTarget(role);
        setSelectedPermissions([...role.permissions]);
        setShowPermissionEditor(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editId) {
                await updateRole(editId, formData);
                toast.success("Role updated successfully");
            } else {
                await createRole(formData);
                toast.success("Role created successfully");
            }
            setShowForm(false);
            setFormData({ ...emptyForm });
            setEditId(null);
            await loadData();
        } catch (err) {
            toast.error("Save failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleSavePermissions = async () => {
        if (!permissionTarget) return;
        setSubmitting(true);
        try {
            const permissionIds = permissions
                .filter((p) => selectedPermissions.includes(p.name))
                .map((p) => p.id);
            await updateRolePermissions(permissionTarget.id, permissionIds);
            toast.success("Role permissions updated successfully");
            setShowPermissionEditor(false);
            setPermissionTarget(null);
            await loadData();
        } catch (err) {
            toast.error("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const togglePermission = (name) => {
        setSelectedPermissions((prev) =>
            prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
        );
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteRole(deleteTarget.id);
            toast.success("Role deleted successfully");
            setDeleteTarget(null);
            await loadData();
        } catch (err) {
            toast.error("Delete failed: " + (err.response?.data?.message || err.message));
        }
    };

    const inputClass = "w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

    return (
        <div className="space-y-6">
            <PageHeader
                title="Role Management"
                action={canManage ? undefined : null}
                actionLabel="+ Add Role"
                onAction={canManage ? handleAdd : undefined}
            />

            {showForm && (
                <Modal title={editId ? "Edit Role" : "Add Role"} onClose={() => setShowForm(false)} maxWidth="max-w-md">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className={labelClass}>Role Name *</label>
                                <input
                                    name="name"
                                    placeholder="e.g. Nurse"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting && <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {editId ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showPermissionEditor && permissionTarget && (
                <Modal
                    title={`Permissions - ${formatRoleName(permissionTarget.name)}`}
                    onClose={() => {
                        setShowPermissionEditor(false);
                        setPermissionTarget(null);
                    }}
                    maxWidth="max-w-4xl"
                >
                    <div className="space-y-6">
                        <p className="text-sm text-slate-500">
                            Select which actions this role is allowed to perform.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-h-[50vh] overflow-y-auto pr-2">
                            {permissionGroups.map(([module, modulePermissions]) => (
                                <div key={module}>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                        {module}
                                    </h4>
                                    <div className="space-y-1.5">
                                        {modulePermissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(permission.name)}
                                                    onChange={() => togglePermission(permission.name)}
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-slate-700">{permission.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => {
                                    setShowPermissionEditor(false);
                                    setPermissionTarget(null);
                                }}
                                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePermissions}
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting && <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                Save Permissions
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {deleteTarget && (
                <ConfirmDialog
                    title="Delete Role"
                    message={`Are you sure you want to delete the role "${deleteTarget.name}"? Users with this role will lose access.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    confirmLabel="Delete"
                    danger
                />
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="Loading roles..." />
                ) : roles.length === 0 ? (
                    <EmptyState message="No roles found." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Permissions</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {role.name === "ROLE_SUPER_ADMIN"
                                                    ? <ShieldCheck className="w-4 h-4 text-blue-600" />
                                                    : <Shield className="w-4 h-4 text-slate-400" />}
                                                <span className="font-medium text-slate-800">{formatRoleName(role.name)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{role.description || "-"}</td>
                                        <td className="px-4 py-3 text-slate-600">{role.permissions.length} permission(s)</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleOpenPermissions(role)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded text-sm transition-colors inline-flex items-center gap-1"
                                            >
                                                <Shield className="w-3.5 h-3.5" /> Permissions
                                            </button>
                                            {canManage && role.name !== "ROLE_SUPER_ADMIN" && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(role)}
                                                        className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-2 py-1 rounded text-sm transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <PenSquare className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(role)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!canManage && (
                <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> You have read-only access. Contact an administrator to make changes.
                </p>
            )}
        </div>
    );
}

export default Roles;
