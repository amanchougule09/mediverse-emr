import { ChevronUp, ChevronDown } from "lucide-react";

export default function SortableHeader({ label, sortKey, sortConfig, onSort, className = "" }) {
    const isActive = sortConfig.key === sortKey;
    return (
        <th
            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 transition-colors ${className}`}
            onClick={() => onSort(sortKey)}
        >
            <div className="flex items-center gap-1">
                {label}
                <span className="flex flex-col -space-y-1">
                    <ChevronUp className={`w-3 h-3 ${isActive && sortConfig.direction === "asc" ? "text-blue-600" : "text-slate-300"}`} />
                    <ChevronDown className={`w-3 h-3 ${isActive && sortConfig.direction === "desc" ? "text-blue-600" : "text-slate-300"}`} />
                </span>
            </div>
        </th>
    );
}
