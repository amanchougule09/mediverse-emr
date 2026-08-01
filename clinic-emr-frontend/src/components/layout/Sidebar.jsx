import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const menuItems = [
    { name: "Dashboard", path: "/dashboard", permission: "dashboard:view" },
    { name: "Patients", path: "/patients", permission: "patient:view" },
    { name: "Doctors", path: "/doctors", permission: "doctor:view" },
    { name: "Appointments", path: "/appointments", permission: "appointment:view" },
    { name: "Consultations", path: "/consultations", permission: "consultation:view" },
    { name: "Prescriptions", path: "/prescriptions", permission: "prescription:view" },
    { name: "Billing", path: "/billing", permission: "billing:view" },
    { name: "Laboratory", path: "/laboratory", permission: "laboratory:view" },
    { name: "Pharmacy", path: "/pharmacy", permission: "pharmacy:view" },
    { name: "Notifications", path: "/notifications", permission: "notification:view" },
    { name: "Audit", path: "/audits", permission: "audit:view" },
    { name: "Files", path: "/files", permission: "file:view" },
];

const adminItems = [
    { name: "Roles", path: "/roles", permission: "role:view" },
    { name: "Users", path: "/users", permission: "user:view" },
];

function formatRole(role) {
    if (!role) return "Role";
    return role.replace("ROLE_", "").replace(/_/g, " ").toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Sidebar({ onNavigate }) {
    const { username, role, hasPermission } = useAuth();

    const visibleMenu = menuItems.filter((item) => hasPermission(item.permission));
    const visibleAdmin = adminItems.filter((item) => hasPermission(item.permission));

    return (
        <aside className="w-64 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl">
            <div className="px-6 py-5 border-b border-slate-700/50">
                <h1 className="text-xl font-bold tracking-tight">
                    <span className="text-blue-400">Clinic</span> EMR
                </h1>
                <p className="text-xs text-slate-400 mt-1">Healthcare Management</p>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {visibleMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                            }`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}

                {visibleAdmin.length > 0 && visibleMenu.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-slate-700/50">
                        <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Administration
                        </p>
                    </div>
                )}

                {visibleAdmin.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                            }`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-700/30">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                        {username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{username || "User"}</p>
                        <p className="text-xs text-slate-400 truncate">{formatRole(role)}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
