import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PendingApproval() {
    const navigate = useNavigate();
    const { logout, username } = useAuth();

    const handleBackToLogin = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="text-center max-w-md">
                <div className="mx-auto w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">Account Pending Approval</h1>
                <p className="mt-2 text-slate-500">
                    Your account has been created, but an administrator has not assigned you a role yet.
                    You will be able to access the system once a role is assigned. Please contact your administrator.
                </p>
                {username && <p className="mt-2 text-sm text-slate-400">Signed in as {username}</p>}
                <div className="mt-6">
                    <button
                        onClick={handleBackToLogin}
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
