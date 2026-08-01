import { useEffect, useRef } from "react";

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = "Delete", danger = true }) {
    const ref = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") onCancel(); };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onCancel]);

    return (
        <div
            ref={ref}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={(e) => { if (e.target === ref.current) onCancel(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                            danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
