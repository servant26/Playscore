import { router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const PER_PAGE = 10;

export default function GameListTab({ gameList }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

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

    const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#F5F7F5] text-lg font-semibold">
                    My Game List ({filtered.length})
                </h2>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search your list..."
                    className="w-64 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                />
            </div>

            {paginated.length === 0 ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center">
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
                            className="cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3 flex items-center gap-4 hover:border-[#2E3A32] transition"
                        >
                            <img
                                src={game.cover_url}
                                alt={game.title}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <h3 className="text-[#F5F7F5] text-sm font-medium truncate">
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

                            <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => openTrailer(game.title)}
                                    className="rounded-md bg-[#1F2923] text-[#8B948F] text-xs font-medium px-4 py-2 hover:bg-[#2E3A32] hover:text-[#F5F7F5] transition"
                                >
                                    Trailer
                                </button>
                                <button
                                    onClick={() => toggleList(game.id, game.slug)}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="rounded-md text-xs font-medium px-4 py-2 hover:opacity-90 transition"
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