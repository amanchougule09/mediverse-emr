import { useState, useMemo } from "react";

export default function usePagination(data, defaultPageSize = 10) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize]);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const changePageSize = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    return {
        paginatedData,
        currentPage,
        totalPages,
        pageSize,
        totalItems: data.length,
        goToPage,
        nextPage,
        prevPage,
        setPageSize: changePageSize,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
    };
}
