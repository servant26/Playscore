import { router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

export default function GameListTab({ gameList }) {
    const [search, setSearch] = useState('');
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

    const filtered = useMemo(() => {
        if (!search.trim()) return gameList;
        const q = search.toLowerCase();
        return gameList.filter((g) => g.title.toLowerCase().includes(q));
    }, [search, gameList]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-[#F5F7F5] text-base sm:text-lg font-semibold">
                    My Game List ({filtered.length})
                </h2>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search your list..."
                    className="w-full sm:w-64 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
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