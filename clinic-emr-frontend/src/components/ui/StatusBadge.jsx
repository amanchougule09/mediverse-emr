const badgeStyles = {
    SCHEDULED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    CONFIRMED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 ring-1 ring-red-200",
    NO_SHOW: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    PENDING: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    PAID: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    PARTIAL: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    SENT: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    FAILED: "bg-red-50 text-red-700 ring-1 ring-red-200",
    IN_STOCK: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    OUT_OF_STOCK: "bg-red-50 text-red-700 ring-1 ring-red-200",
    EXPIRED: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    DISCONTINUED: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
    CREATE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    READ: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    UPDATE: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    DELETE: "bg-red-50 text-red-700 ring-1 ring-red-200",
    APPOINTMENT: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    REMINDER: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    FOLLOW_UP: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    BILLING: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    GENERAL: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
};

export default function StatusBadge({ status, className = "" }) {
    const style = badgeStyles[status] || "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style} ${className}`}>
            {status?.replace(/_/g, " ") || "-"}
        </span>
    );
}
