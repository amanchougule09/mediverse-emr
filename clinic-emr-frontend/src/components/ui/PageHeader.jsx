export default function PageHeader({ title, action, actionLabel, onAction }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {action || (
                onAction && (
                    <button
                        onClick={onAction}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
                    >
                        {actionLabel || "+ Add"}
                    </button>
                )
            )}
        </div>
    );
}
