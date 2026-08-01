import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const data = await forgotPassword({ email });
            setResult(data);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.errors?.join(", ") ||
                "Failed to request password reset.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-800">Clinic EMR</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {result ? (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset token generated</h2>
                            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-4">
                                <p className="text-sm text-emerald-700">{result.message}</p>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                                Since no email server is configured, your reset token is shown here.
                                Copy it and use it on the reset password page. It expires in 30 minutes.
                            </p>
                            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Reset Token</p>
                                <p className="text-sm font-mono break-all text-slate-800">{result.resetToken}</p>
                            </div>
                            <button
                                onClick={() => navigate("/reset-password", { state: { token: result.resetToken } })}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Continue to Reset Password
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Forgot password</h2>
                                <p className="text-slate-500 mt-1">
                                    Enter your account email and we'll generate a reset token for you
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your account email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Request Reset Token"
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    <p className="text-center mt-6 text-sm text-slate-500">
                        Remembered your password?{" "}
                        <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
