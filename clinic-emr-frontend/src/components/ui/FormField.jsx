export default function FormField({ label, required, children, error, className = "" }) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export const inputClass = "w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
export const selectClass = `${inputClass} bg-white`;
export const textareaClass = `${inputClass} resize-none`;
