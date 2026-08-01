import AppLayout from '@/Layouts/AppLayout';
import GameCard from '@/Components/GameCard';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const PER_PAGE = 10;

export default function PublicShow({ profileUser, interests, reviews, myListIds }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [listIds, setListIds] = useState(myListIds || []);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const initials = profileUser.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const goToGame = (slug) => {
        router.get(route('games.show', slug));
    };

    const toggleList = (gameId, gameSlug) => {
        const isInList = listIds.includes(gameId);

        setListIds((prev) =>
            isInList ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        );

        router.post(
            route('game-list.toggle', gameSlug),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return reviews;
        const q = search.toLowerCase();
        return reviews.filter((r) => r.game.title.toLowerCase().includes(q));
    }, [search, reviews]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <AppLayout>
            <Head title={profileUser.name} />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className="w-16 h-16 aspect-square rounded-full bg-[#131916] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-xl font-semibold overflow-hidden shrink-0"
                        style={{ minWidth: '64px', minHeight: '64px' }}
                    >
                        {profileUser.avatar ? (
                            <img
                                src={`/storage/${profileUser.avatar}`}
                                alt={profileUser.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <h1 className="text-[#F5F7F5] text-xl font-semibold">{profileUser.name}</h1>
                        <p className="text-[#8B948F] text-sm mt-1">
                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                </div>

                {/* Interests inline with header */}
                {interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {interests.map((interest) => (
                            <span
                                key={interest.id}
                                className="px-3 py-1.5 rounded-full text-xs bg-[#131916] border border-[#1F2923] text-[#8B948F]"
                            >
                                {interest.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Reviews grid */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#F5F7F5] text-lg font-semibold">
                        Reviews ({filtered.length})
                    </h2>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search reviews..."
                        className="w-64 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                    />
                </div>

                {paginated.length === 0 ? (
                    <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center">
                        <p className="text-[#8B948F] text-sm">
                            {reviews.length === 0 ? 'No reviews yet.' : `No reviews match "${search}".`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {paginated.map((review) => (
                            <div key={review.id} className="relative">
                                <div
                                    onClick={() => setSelectedReview(review)}
                                    className="absolute top-2 left-2 z-10 bg-[#0B0F0D]/80 backdrop-blur-sm text-[#22C55E] text-xs font-semibold px-2 py-1 rounded-md cursor-pointer hover:bg-[#0B0F0D] transition"
                                >
                                    {Number(review.rating).toFixed(1)} ★
                                </div>
                                <GameCard
                                    game={review.game}
                                    isInList={listIds.includes(review.game.id)}
                                    onToggleList={toggleList}
                                />
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

            {/* Review detail modal */}
            {selectedReview && (
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
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#22C55E] text-2xl font-bold">
                                    {Number(selectedReview.rating).toFixed(1)}
                                </span>
                                <span className="text-[#5A625D] text-sm">/ 10</span>
                                <span className="text-[#22C55E] text-lg">★</span>
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
                                    Close
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
        </AppLayout>
    );
}