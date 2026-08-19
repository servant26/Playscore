import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Search({ query, games = [], users = [] }) {
    const [activeTab, setActiveTab] = useState(() => {
        if (games.length === 0 && users.length > 0) return 'users';
        return 'games';
    });

    const goToProfile = (userId) => {
        router.get(route('users.show', userId));
    };

    const hasResults = games.length > 0 || users.length > 0;

    return (
        <AppLayout>
            <Head title={`Search: ${query}`} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-[#F5F7F5] text-xl font-semibold">
                    Search results for "{query}"
                </h2>

                {/* Filter Tabs */}
                {hasResults && (
                    <div className="flex items-center gap-2 bg-[#131916] border border-[#1F2923] p-1 rounded-lg shrink-0 self-start sm:self-auto">
                        <button
                            onClick={() => setActiveTab('games')}
                            className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                                activeTab === 'games'
                                    ? 'bg-[#22C55E] text-[#0B0F0D] font-semibold'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                        >
                            Games ({games.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                                activeTab === 'users'
                                    ? 'bg-[#22C55E] text-[#0B0F0D] font-semibold'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                        >
                            Users ({users.length})
                        </button>
                    </div>
                )}
            </div>

            {!hasResults ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 sm:p-16 text-center">
                    <p className="text-[#F5F7F5] text-lg font-medium mb-2">
                        Not Found
                    </p>
                    <p className="text-[#8B948F] text-sm">
                        We couldn't find any games or users matching "{query}". Try a different keyword.
                    </p>
                </div>
            ) : (
                <>
                    {/* Games Tab */}
                    {activeTab === 'games' && (
                        games.length === 0 ? (
                            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center text-[#8B948F] text-sm">
                                No games matching "{query}".
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {games.map((game) => (
                                    <RawgGameCard key={game.external_id} game={game} />
                                ))}
                            </div>
                        )
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        users.length === 0 ? (
                            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center text-[#8B948F] text-sm">
                                No users matching "{query}".
                            </div>
                        ) : (
                            <div className="space-y-3 w-full">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => goToProfile(user.id)}
                                        className="group cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 hover:border-[#2E3A32] transition"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                            {/* Avatar */}
                                            <div
                                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm sm:text-base font-semibold overflow-hidden shrink-0"
                                                style={{ minWidth: '48px', minHeight: '48px' }}
                                            >
                                                {user.avatar ? (
                                                    <img
                                                        src={`/storage/${user.avatar}`}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.name.slice(0, 2).toUpperCase()
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[#F5F7F5] text-sm sm:text-base font-medium truncate mb-1 group-hover:text-[#22C55E] transition">
                                                    {user.name}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="text-[#22C55E] font-medium bg-[#22C55E]/10 px-2 py-0.5 rounded">
                                                        {user.total_reviews} {user.total_reviews === 1 ? 'Review' : 'Reviews'}
                                                    </span>

                                                    {user.top_genres && user.top_genres.length > 0 && (
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {user.top_genres.slice(0, 3).map((genre) => (
                                                                <span
                                                                    key={genre}
                                                                    className="bg-[#1F2923] text-[#8B948F] text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-medium"
                                                                >
                                                                    {genre}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToProfile(user.id);
                                            }}
                                            className="w-full sm:w-auto shrink-0 rounded-lg bg-[#1F2923] text-[#F5F7F5] px-4 py-2 text-xs sm:text-sm font-medium hover:bg-[#2E3A32] hover:text-[#22C55E] transition text-center"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </>
            )}
        </AppLayout>
    );
}