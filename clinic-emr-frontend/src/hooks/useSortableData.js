import { useState, useMemo } from "react";

export default function useSortableData(data, defaultKey = "id", defaultDirection = "asc") {
    const [sortConfig, setSortConfig] = useState({ key: defaultKey, direction: defaultDirection });

    const sortedData = useMemo(() => {
        if (!data || data.length === 0) return data;
        return [...data].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (aVal == null) aVal = "";
            if (bVal == null) bVal = "";

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }

            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();
            if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const requestSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return { sortedData, sortConfig, requestSort };
}
