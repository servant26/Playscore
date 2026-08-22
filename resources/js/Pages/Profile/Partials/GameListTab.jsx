import { router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

export default function GameListTab({ gameList }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('rating_desc');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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

    const toggleList = (gameId, gameSlug) => {
        router.post(
            route('game-list.toggle', gameSlug),
            {},
            { preserveScroll: true }
        );
    };

    const openTrailer = (title) => {
        const query = encodeURIComponent(`${title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const goToDetail = (slug) => {
        router.get(route('games.show', slug));
    };

    const sortedAndFiltered = useMemo(() => {
        let result = [...gameList];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((g) => g.title.toLowerCase().includes(q));
        }

        result.sort((a, b) => {
            const ratingA = Number(a.rawg_rating || 0);
            const ratingB = Number(b.rawg_rating || 0);
            const titleA = (a.title || '').toLowerCase();
            const titleB = (b.title || '').toLowerCase();

            switch (sortBy) {
                case 'rating_desc':
                    return ratingB - ratingA;
                case 'rating_asc':
                    return ratingA - ratingB;
                case 'title_asc':
                    return titleA.localeCompare(titleB);
                case 'title_desc':
                    return titleB.localeCompare(titleA);
                case 'latest':
                    return (b.id || 0) - (a.id || 0);
                default:
                    return ratingB - ratingA;
            }
        });

        return result;
    }, [search, gameList, sortBy]);

    const totalPages = Math.ceil(sortedAndFiltered.length / perPage) || 1;
    const paginated = sortedAndFiltered.slice((page - 1) * perPage, page * perPage);

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    if (gameList.length === 0) {
        return (
            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center">
                <p className="text-[#8B948F] text-sm">
                    You haven't added any games to your list yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[#F5F7F5] text-sm sm:text-lg font-semibold">
                        My Game List ({sortedAndFiltered.length})
                    </h2>

                    {/* Custom Styled Sort Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1.5 bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-[#F5F7F5] text-[11px] sm:text-sm font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition shadow-sm"
                        >
                            <span>
                                {sortBy === 'rating_desc' && 'Rating (Highest)'}
                                {sortBy === 'rating_asc' && 'Rating (Lowest)'}
                                {sortBy === 'latest' && 'Recently Added'}
                                {sortBy === 'title_asc' && 'Alphabet (A - Z)'}
                                {sortBy === 'title_desc' && 'Alphabet (Z - A)'}
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
                                        Sort Games By
                                    </div>
                                    {[
                                        { id: 'rating_desc', label: 'Rating (Highest)' },
                                        { id: 'rating_asc', label: 'Rating (Lowest)' },
                                        { id: 'latest', label: 'Recently Added' },
                                        { id: 'title_asc', label: 'Alphabet (A - Z)' },
                                        { id: 'title_desc', label: 'Alphabet (Z - A)' },
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
                    placeholder="Search your list..."
                    className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                />
            </div>

            {paginated.length === 0 ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-8 sm:p-12 text-center">
                    <p className="text-[#8B948F] text-sm">
                        No games match "{search}".
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {paginated.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => goToDetail(game.slug)}
                            className="cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 hover:border-[#2E3A32] transition"
                        >
                            <img
                                src={game.cover_url}
                                alt={game.title}
                                onError={(e) => {
                                    e.target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#131916"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#22C55E" font-family="sans-serif" font-size="14" font-weight="bold">${game.title.replace(/&/g, '&amp;')}</text></svg>`
                                    )}`;
                                }}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-[140px]">
                                <h3 className="text-[#F5F7F5] text-xs sm:text-sm font-medium truncate">
                                    {game.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    {game.rawg_rating && (
                                        <span className="text-[#22C55E] text-xs font-semibold">
                                            ★ {Number(game.rawg_rating).toFixed(1)}
                                        </span>
                                    )}
                                    {game.interests?.length > 0 && (
                                        <span className="text-[#5A625D] text-xs truncate">
                                            {game.interests.map((i) => i.name).join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-1 sm:mt-0 pt-2 sm:pt-0 border-t border-[#1F2923] sm:border-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openTrailer(game.title);
                                    }}
                                    className="flex-1 sm:flex-initial rounded-md bg-[#1F2923] text-[#8B948F] text-xs font-medium px-3 py-1.5 hover:bg-[#2E3A32] hover:text-[#F5F7F5] transition text-center"
                                >
                                    Trailer
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleList(game.id, game.slug);
                                    }}
                                    className="flex-1 sm:flex-initial rounded-md bg-[#22C55E] text-[#0B0F0D] text-xs font-medium px-3 py-1.5 hover:bg-[#16A34A] transition text-center"
                                >
                                    ✓ In List
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-3 py-1.5 text-sm hover:border-[#2E3A32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`rounded-lg px-3 py-1.5 text-sm transition ${p === page
                                    ? 'bg-[#22C55E] text-[#0B0F0D] font-medium'
                                    : 'border border-[#1F2923] text-[#8B948F] hover:border-[#2E3A32]'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-3 py-1.5 text-sm hover:border-[#2E3A32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}