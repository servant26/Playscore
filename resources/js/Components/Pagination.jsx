export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className = '',
}) {
    if (totalPages <= 1) return null;

    // Generate responsive smart window of page numbers
    // Mobile: max 3 numbers, Tablet: max 5 numbers, Desktop: max 7 numbers
    const getPageNumbers = () => {
        // If total pages <= 5, just show all
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        // Always include 1
        pages.push(1);

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Always include lastPage
        pages.push(totalPages);

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-1 sm:gap-2 pt-4 pb-2 select-none overflow-x-auto scrollbar-none ${className}`}>
            {/* Prev Button */}
            <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-lg border border-[#1F2923] text-[#8B948F] text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
                Prev
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {pages.map((p, idx) => {
                    if (p === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="w-6 sm:w-8 text-center text-xs sm:text-sm text-[#5A625D] font-bold"
                            >
                                …
                            </span>
                        );
                    }

                    const isActive = p === currentPage;

                    return (
                        <button
                            key={`page-${p}`}
                            type="button"
                            onClick={() => onPageChange(p)}
                            className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center shrink-0 ${
                                isActive
                                    ? 'bg-[#22C55E] text-[#0B0F0D] shadow-[0_0_12px_rgba(34,197,94,0.35)]'
                                    : 'border border-[#1F2923] text-[#8B948F] hover:border-[#2E3A32] hover:text-[#F5F7F5]'
                            }`}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-lg border border-[#1F2923] text-[#8B948F] text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
                Next
            </button>
        </div>
    );
}
