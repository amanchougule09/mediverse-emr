import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="text-center">
                <p className="text-7xl font-bold text-slate-200">404</p>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">Page Not Found</h1>
                <p className="mt-2 text-slate-500">The page you are looking for doesn't exist or has been moved.</p>
                <Link
                    to="/"
                    className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
