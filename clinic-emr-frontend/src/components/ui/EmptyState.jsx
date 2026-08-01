export default function EmptyState({ message = "No data found.", icon }) {
    return (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            {icon || (
                <svg className="h-12 w-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
}
