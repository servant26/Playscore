import RatingModal from '@/Components/RatingModal';
import ConfirmModal from '@/Components/ConfirmModal';
import { router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

export default function MyReviewTab({ myReviews }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('rating_desc'); // rating_desc, latest_review, rating_asc, title_asc, title_desc, date_desc, date_asc
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setPerPage(5);
            } else {
                setPerPage(10);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const goToGame = (slug) => {
        router.get(route('games.show', slug));
    };

    const confirmDeleteReview = () => {
        router.delete(route('reviews.destroy', reviewToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setReviewToDelete(null);
                setSelectedReview(null);
            },
        });
    };

    const filtered = useMemo(() => {
        let list = [...myReviews];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (r) =>
                    r.game.title.toLowerCase().includes(q) ||
                    (r.body && r.body.toLowerCase().includes(q))
            );
        }

        if (sortBy === 'title_asc') {
            list.sort((a, b) => a.game.title.localeCompare(b.game.title));
        } else if (sortBy === 'title_desc') {
            list.sort((a, b) => b.game.title.localeCompare(a.game.title));
        } else if (sortBy === 'rating_desc') {
            list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'rating_asc') {
            list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else if (sortBy === 'date_desc') {
            list.sort((a, b) => new Date(b.game.release_date || 0) - new Date(a.game.release_date || 0));
        } else if (sortBy === 'date_asc') {
            list.sort((a, b) => new Date(a.game.release_date || 0) - new Date(b.game.release_date || 0));
        } else if (sortBy === 'latest_review') {
            list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        return list;
    }, [search, myReviews, sortBy]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    if (myReviews.length === 0) {
        return (
            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center">
                <p className="text-[#8B948F] text-sm">
                    You haven't reviewed any games yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[#F5F7F5] text-sm sm:text-lg font-semibold">
                        My Reviews ({filtered.length})
                    </h2>

                    {/* Custom Styled Sort Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1.5 bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-[#F5F7F5] text-[11px] sm:text-sm font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition shadow-sm"
                        >
                            <span>
                                {sortBy === 'latest_review' && 'Latest Review'}
                                {sortBy === 'title_asc' && 'Alphabet (A - Z)'}
                                {sortBy === 'title_desc' && 'Alphabet (Z - A)'}
                                {sortBy === 'rating_desc' && 'Rating (Highest)'}
                                {sortBy === 'rating_asc' && 'Rating (Lowest)'}
                                {sortBy === 'date_desc' && 'Release Date (Newest)'}
                                {sortBy === 'date_asc' && 'Release Date (Oldest)'}
                            </span>
                            <svg
                                className={`w-3.5 h-3.5 text-[#8B948F] transition-transform duration-200 ${
                                    isSortDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isSortDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setIsSortDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-1.5 w-52 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl py-1.5 z-30 overflow-hidden">
                                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#8B948F] uppercase tracking-wider border-b border-[#1F2923]">
                                        Sort Reviews By
                                    </div>
                                    {[
                                        { id: 'rating_desc', label: 'Rating (Highest)' },
                                        { id: 'rating_asc', label: 'Rating (Lowest)' },
                                        { id: 'title_asc', label: 'Alphabet (A - Z)' },
                                        { id: 'title_desc', label: 'Alphabet (Z - A)' },
                                        { id: 'date_desc', label: 'Release Date (Newest)' },
                                        { id: 'date_asc', label: 'Release Date (Oldest)' },
                                        { id: 'latest_review', label: 'Latest Review' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setSortBy(opt.id);
                                                setPage(1);
                                                setIsSortDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                                                sortBy === opt.id
                                                    ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                    : 'text-[#8B948F] hover:bg-[#1F2923] hover:text-[#F5F7F5]'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {sortBy === opt.id && (
                                                <span className="text-[#22C55E] font-bold">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <input
                    type="text"
                    autoFocus
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search reviews..."
                    className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                />
            </div>

            {paginated.length === 0 ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-8 sm:p-12 text-center">
                    <p className="text-[#8B948F] text-sm">
                        No reviews match "{search}".
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {paginated.map((review) => (
                        <div
                            key={review.id}
                            onClick={() => setSelectedReview(review)}
                            className="cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3 flex items-center gap-4 hover:border-[#2E3A32] transition"
                        >
                            <img
                                src={review.game.cover_url}
                                alt={review.game.title}
                                onError={(e) => {
                                    e.target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#131916"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#22C55E" font-family="sans-serif" font-size="14" font-weight="bold">${review.game.title.replace(/&/g, '&amp;')}</text></svg>`
                                    )}`;
                                }}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <h3 className="text-[#F5F7F5] text-xs sm:text-sm font-medium truncate">
                                    {review.game.title}
                                </h3>
                                <p className="text-[#5A625D] text-xs mt-1">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                            <span className="text-[#22C55E] text-xs sm:text-sm font-semibold shrink-0 flex items-center gap-1">
                                {Number(review.rating).toFixed(1)}
                                <span>★</span>
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1F2923]">
                    <p className="text-xs text-[#8B948F]">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-[#1F2923] text-xs text-[#8B948F] hover:border-[#2E3A32] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-[#1F2923] text-xs text-[#8B948F] hover:border-[#2E3A32] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {selectedReview && !showEditModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
                    onClick={() => setSelectedReview(null)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-xl overflow-hidden max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedReview.game.cover_url}
                            alt={selectedReview.game.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-[#F5F7F5] text-lg font-semibold mb-1">
                                {selectedReview.game.title}
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#22C55E] text-2xl font-bold">
                                        {Number(selectedReview.rating).toFixed(1)}
                                    </span>
                                    <span className="text-[#5A625D] text-sm">/ 10</span>
                                    <span className="text-[#22C55E] text-lg">★</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="text-[#8B948F] hover:text-[#22C55E] transition"
                                        title="Edit review"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setReviewToDelete(selectedReview.id)}
                                        className="text-[#8B948F] hover:text-red-400 transition"
                                        title="Delete review"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {selectedReview.body && (
                                <p className="text-[#8B948F] text-sm leading-relaxed mb-6">
                                    {selectedReview.body}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="flex-1 rounded-lg border border-[#1F2923] text-[#8B948F] py-2.5 text-sm hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => goToGame(selectedReview.game.slug)}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="flex-1 rounded-lg font-medium py-2.5 text-sm hover:opacity-90 transition"
                                >
                                    View Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedReview && (
                <RatingModal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedReview(null);
                    }}
                    gameSlug={selectedReview.game.slug}
                    existingReview={selectedReview}
                />
            )}

            <ConfirmModal
                show={reviewToDelete !== null}
                title="Delete Review?"
                message="Are you sure you want to delete this review? This cannot be undone."
                onConfirm={confirmDeleteReview}
                onCancel={() => setReviewToDelete(null)}
            />
        </div>
    );
}