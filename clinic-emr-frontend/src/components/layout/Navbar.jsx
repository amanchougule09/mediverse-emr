import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmDialog from "../ui/ConfirmDialog";

const routeLabels = {
    "/dashboard": "Dashboard",
    "/patients": "Patients",
    "/doctors": "Doctors",
    "/appointments": "Appointments",
    "/consultations": "Consultations",
    "/prescriptions": "Prescriptions",
    "/billing": "Billing",
    "/laboratory": "Laboratory",
    "/pharmacy": "Pharmacy",
    "/notifications": "Notifications",
    "/audits": "Audit",
    "/files": "Files",
    "/roles": "Roles",
    "/users": "Users",
};

function Navbar({ onMenuClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, logout } = useAuth();
    const [showLogout, setShowLogout] = useState(false);

    const currentPage = routeLabels[location.pathname] || "Dashboard";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span>Clinic EMR</span>
                    <span>/</span>
                    <span className="text-slate-800 font-medium">{currentPage}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow">
                        {username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                        {username}
                    </span>
                </div>
                <button
                    onClick={() => setShowLogout(true)}
                    className="text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors duration-200"
                >
                    Logout
                </button>
            </div>

            {showLogout && (
                <ConfirmDialog
                    title="Confirm Logout"
                    message="Are you sure you want to logout? You will need to sign in again."
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogout(false)}
                    confirmLabel="Logout"
                    danger={true}
                />
            )}
        </header>
    );
}

export default Navbar;
