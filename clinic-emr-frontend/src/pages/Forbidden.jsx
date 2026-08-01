import { Link, useNavigate } from "react-router-dom";

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="text-center">
                <p className="text-7xl font-bold text-slate-200">403</p>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">Access Denied</h1>
                <p className="mt-2 text-slate-500">
                    You don't have permission to view this page. Contact your administrator if you believe this is a mistake.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-block px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/dashboard"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
