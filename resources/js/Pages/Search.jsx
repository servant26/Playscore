import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import RatingModal from '@/Components/RatingModal';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export default function Search({ query, games = [], users = [], recommendedUsers = [] }) {
    const [activeTab, setActiveTab] = useState(() => {
        if (games.length === 0 && users.length > 0) return 'users';
        return 'games';
    });

    const [gamePage, setGamePage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [recPage, setRecPage] = useState(1);

    const [ratingModal, setRatingModal] = useState({ show: false, gameSlug: '', existingReview: null });
    const [sortBy, setSortBy] = useState('relevance'); // relevance, title_asc, title_desc, date_desc, date_asc, rating_desc, rating_asc
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const goToProfile = (userId) => {
        router.get(route('users.show', userId));
    };

    const hasResults = games.length > 0 || users.length > 0;

    // Sorting logic for games
    const sortedGames = useMemo(() => {
        let list = [...games];
        if (sortBy === 'title_asc') {
            list.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'title_desc') {
            list.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortBy === 'date_desc') {
            list.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        } else if (sortBy === 'date_asc') {
            list.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
        } else if (sortBy === 'rating_desc') {
            list.sort((a, b) => (b.rawg_rating || 0) - (a.rawg_rating || 0));
        } else if (sortBy === 'rating_asc') {
            list.sort((a, b) => (a.rawg_rating || 0) - (b.rawg_rating || 0));
        }
        return list;
    }, [games, sortBy]);

    // Searched Games Pagination
    const totalGamePages = Math.ceil(sortedGames.length / ITEMS_PER_PAGE);
    const paginatedGames = sortedGames.slice((gamePage - 1) * ITEMS_PER_PAGE, gamePage * ITEMS_PER_PAGE);

    // Searched Users Pagination
    const totalUserPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);

    // Recommended Users Pagination
    const totalRecPages = Math.ceil(recommendedUsers.length / ITEMS_PER_PAGE);
    const paginatedRecUsers = recommendedUsers.slice((recPage - 1) * ITEMS_PER_PAGE, recPage * ITEMS_PER_PAGE);

    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
            return avatar;
        }
        return `/storage/${avatar}`;
    };

    return (
        <AppLayout>
            <Head title={`Search: ${query}`} />

            <div className="max-w-[1216px] mx-auto w-full pb-16 sm:pb-24">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-[#F5F7F5] text-xl font-semibold">
                        {query ? `Search results for "${query}"` : 'Discover Users & Games'}
                    </h2>

                    {/* Filter & Sort Bar: 1 block on mobile */}
                    {hasResults && (
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto w-full sm:w-auto">
                            {/* Sorting Dropdown (Only visible on Games tab) */}
                            {activeTab === 'games' && games.length > 0 && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                        className="flex items-center justify-between gap-1.5 bg-[#131916] border border-[#1F2923] text-[#F5F7F5] px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:border-[#22C55E]/50 transition h-full"
                                    >
                                        <span>
                                            {sortBy === 'relevance' && 'Default Relevance'}
                                            {sortBy === 'title_asc' && 'Alphabet (A - Z)'}
                                            {sortBy === 'title_desc' && 'Alphabet (Z - A)'}
                                            {sortBy === 'date_desc' && 'Release Date (Newest)'}
                                            {sortBy === 'date_asc' && 'Release Date (Oldest)'}
                                            {sortBy === 'rating_desc' && 'Rating (Highest)'}
                                            {sortBy === 'rating_asc' && 'Rating (Lowest)'}
                                        </span>
                                        <svg className="w-3.5 h-3.5 text-[#8B948F] ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showSortDropdown && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-20"
                                                onClick={() => setShowSortDropdown(false)}
                                            />
                                            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl z-30 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                                <div className="px-3 py-1.5 text-[11px] font-bold text-[#8B948F] uppercase tracking-wider border-b border-[#1F2923]">
                                                    Sort Games By
                                                </div>
                                                {[
                                                    { id: 'relevance', label: 'Default Relevance' },
                                                    { id: 'title_asc', label: 'Alphabet (A - Z)' },
                                                    { id: 'title_desc', label: 'Alphabet (Z - A)' },
                                                    { id: 'date_desc', label: 'Release Date (Newest)' },
                                                    { id: 'date_asc', label: 'Release Date (Oldest)' },
                                                    { id: 'rating_desc', label: 'Rating (Highest)' },
                                                    { id: 'rating_asc', label: 'Rating (Lowest)' },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSortBy(opt.id);
                                                            setGamePage(1);
                                                            setShowSortDropdown(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between transition ${
                                                            sortBy === opt.id
                                                                ? 'bg-[#1F2923] text-[#22C55E] font-semibold'
                                                                : 'text-[#F5F7F5] hover:bg-[#161F1A]'
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
                            )}

                            {/* Filter Tabs: 50:50 on mobile */}
                            <div className="flex items-center gap-1 bg-[#131916] border border-[#1F2923] p-1 rounded-lg shrink-0 w-full sm:w-auto">
                                <button
                                    onClick={() => setActiveTab('games')}
                                    className={`flex-1 sm:flex-initial text-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                                        activeTab === 'games'
                                            ? 'bg-[#22C55E] text-[#0B0F0D] font-semibold'
                                            : 'text-[#8B948F] hover:text-[#F5F7F5]'
                                    }`}
                                >
                                    Games ({games.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`flex-1 sm:flex-initial text-center px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                                        activeTab === 'users'
                                            ? 'bg-[#22C55E] text-[#0B0F0D] font-semibold'
                                            : 'text-[#8B948F] hover:text-[#F5F7F5]'
                                    }`}
                                >
                                    Users ({users.length})
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            {!hasResults ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 sm:p-16 text-center mb-8">
                    <p className="text-[#F5F7F5] text-lg font-medium mb-2">
                        Not Found
                    </p>
                    <p className="text-[#8B948F] text-sm">
                        We couldn't find any games or users matching "{query}". Try a different keyword.
                    </p>
                </div>
            ) : (
                <>
                    {/* Games Tab: Horizontal List View */}
                    {activeTab === 'games' && (
                        games.length === 0 ? (
                            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center text-[#8B948F] text-sm">
                                No games matching "{query}".
                            </div>
                        ) : (
                            <div className="space-y-4 w-full">
                                <div className="space-y-3 w-full">
                                    {paginatedGames.map((game) => (
                                        <div
                                            key={game.external_id}
                                            onClick={() => router.get(route('games.import-and-show', game.external_id))}
                                            className="group cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 hover:border-[#2E3A32] transition"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                {/* Game Cover */}
                                                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-[#0B0F0D] border border-[#1F2923] overflow-hidden shrink-0">
                                                    <img
                                                        src={game.cover_url || getFallbackImage(game.title)}
                                                        alt={game.title}
                                                        onError={(e) => { e.target.src = getFallbackImage(game.title); }}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />
                                                </div>

                                                {/* Game Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h3 className="text-[#F5F7F5] text-base sm:text-lg font-bold truncate group-hover:text-[#22C55E] transition">
                                                            {game.title}
                                                        </h3>

                                                        {game.rawg_rating && (
                                                            <span className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                                ★ {Number(game.rawg_rating).toFixed(1)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {game.genres && (
                                                        <p className="text-[#8B948F] text-xs sm:text-sm font-medium truncate">
                                                            {game.genres}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const q = encodeURIComponent(`${game.title} trailer`);
                                                        window.open(`https://www.youtube.com/results?search_query=${q}`, '_blank');
                                                    }}
                                                    className="flex-1 sm:flex-initial rounded-lg bg-[#1F2923] text-[#8B948F] px-3.5 py-2 text-xs sm:text-sm font-medium hover:bg-[#2E3A32] hover:text-[#F5F7F5] transition text-center"
                                                >
                                                    Trailer
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRatingModal({
                                                            show: true,
                                                            gameSlug: game.external_id,
                                                            existingReview: game.user_rating ? { rating: parseFloat(game.user_rating) } : null,
                                                        });
                                                    }}
                                                    className={`flex-1 sm:flex-initial rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition text-center shadow-md ${
                                                        game.user_rating
                                                            ? 'bg-[#161F1A] border border-[#22C55E]/40 text-[#22C55E] hover:bg-[#22C55E]/10'
                                                            : 'bg-[#22C55E] text-[#0B0F0D] hover:bg-[#16A34A] shadow-[#22C55E]/10'
                                                    }`}
                                                >
                                                    {game.user_rating ? `★ Your Rating: ${game.user_rating}` : 'Give Rating'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination for Searched Games */}
                                {totalGamePages > 1 && (
                                    <div className="flex items-center justify-between pt-2 text-xs text-[#8B948F]">
                                        <span>
                                            Showing {((gamePage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(gamePage * ITEMS_PER_PAGE, sortedGames.length)} of {sortedGames.length} games
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setGamePage((p) => Math.max(1, p - 1))}
                                                disabled={gamePage === 1}
                                                className="px-3 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] disabled:opacity-40 hover:border-[#22C55E] transition font-medium"
                                            >
                                                Previous
                                            </button>
                                            <span className="font-semibold text-[#F5F7F5]">
                                                {gamePage} / {totalGamePages}
                                            </span>
                                            <button
                                                onClick={() => setGamePage((p) => Math.min(totalGamePages, p + 1))}
                                                disabled={gamePage === totalGamePages}
                                                className="px-3 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] disabled:opacity-40 hover:border-[#22C55E] transition font-medium"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                            <div className="space-y-4 w-full">
                                <div className="space-y-3 w-full">
                                    {paginatedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => goToProfile(user.id)}
                                            className="group cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                {/* Avatar */}
                                                <div
                                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm sm:text-base font-semibold overflow-hidden shrink-0"
                                                    style={{ minWidth: '48px', minHeight: '48px' }}
                                                >
                                                    {user.avatar ? (
                                                        <img
                                                            src={getAvatarUrl(user.avatar)}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                if (e.target.nextSibling) {
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span style={{ display: user.avatar ? 'none' : 'block' }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[#F5F7F5] text-sm sm:text-base font-medium truncate mb-1 group-hover:text-white transition">
                                                        {user.name}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                                        <span className="text-[#F5F7F5] font-medium bg-[#1F2923] border border-[#2E3A32] px-2.5 py-0.5 rounded-md">
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

                                {/* Pagination for Searched Users */}
                                {totalUserPages > 1 && (
                                    <div className="flex items-center justify-between pt-2 text-xs text-[#8B948F]">
                                        <span>
                                            Showing {((userPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(userPage * ITEMS_PER_PAGE, users.length)} of {users.length} users
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                                                disabled={userPage === 1}
                                                className="px-3 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] disabled:opacity-40 hover:border-[#22C55E] transition font-medium"
                                            >
                                                Previous
                                            </button>
                                            <span className="font-semibold text-[#F5F7F5]">
                                                {userPage} / {totalUserPages}
                                            </span>
                                            <button
                                                onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                                                disabled={userPage === totalUserPages}
                                                className="px-3 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] disabled:opacity-40 hover:border-[#22C55E] transition font-medium"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </>
            )}

            {/* Recommended Users Section (Only visible on Users Tab) */}
            {activeTab === 'users' && recommendedUsers && recommendedUsers.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#1F2923]">
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                            <h3 className="text-[#F5F7F5] text-lg font-bold block">
                                Recommended Users For You
                            </h3>
                            <span className="hidden sm:inline-flex text-xs bg-[#1F2923] border border-[#2E3A32] text-[#F5F7F5] px-2.5 py-0.5 rounded-full font-semibold">
                                Closest Taste
                            </span>
                        </div>
                        <p className="text-[#8B948F] text-xs leading-relaxed">
                            Users with similar genre interests, game lists, and review ratings closest to your taste.
                        </p>
                        {/* Mobile full-width badge below description */}
                        <div className="mt-3 block sm:hidden">
                            <div className="w-full text-center py-1.5 px-3 rounded-lg bg-[#1F2923] border border-[#2E3A32] text-[#F5F7F5] text-xs font-semibold">
                                Closest Taste
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        <div className="space-y-3 w-full">
                            {paginatedRecUsers.map((recUser, idx) => {
                                const globalRank = ((recPage - 1) * ITEMS_PER_PAGE) + idx + 1;
                                return (
                                    <div
                                        key={recUser.id}
                                        onClick={() => goToProfile(recUser.id)}
                                        className="group cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                            {/* Rank Badge + Avatar */}
                                            <div className="relative shrink-0">
                                                <div
                                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm sm:text-base font-semibold overflow-hidden"
                                                    style={{ minWidth: '48px', minHeight: '48px' }}
                                                >
                                                    {recUser.avatar ? (
                                                        <img
                                                            src={getAvatarUrl(recUser.avatar)}
                                                            alt={recUser.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                if (e.target.nextSibling) {
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span style={{ display: recUser.avatar ? 'none' : 'block' }}>
                                                        {recUser.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#1F2923] border border-[#2E3A32] text-white font-bold text-[10px] flex items-center justify-center shadow">
                                                    #{globalRank}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h4 className="text-[#F5F7F5] text-sm sm:text-base font-medium truncate group-hover:text-white transition">
                                                        {recUser.name}
                                                    </h4>

                                                    {/* Taste Match Badge */}
                                                    <span className="bg-[#1F2923] border border-[#2E3A32] text-[#F5F7F5] text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                        <span>{recUser.match_percentage}% Similar Taste</span>
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B948F]">
                                                    <span className="bg-[#1F2923] text-[#8B948F] text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md font-medium">
                                                        {recUser.shared_interests_count} Shared {recUser.shared_interests_count === 1 ? 'Interest' : 'Interests'}
                                                    </span>

                                                    <span className="bg-[#1F2923] text-[#8B948F] text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md font-medium">
                                                        {recUser.shared_reviews_count} Shared {recUser.shared_reviews_count === 1 ? 'Review' : 'Reviews'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToProfile(recUser.id);
                                            }}
                                            className="w-full sm:w-auto shrink-0 rounded-lg bg-[#1F2923] text-[#F5F7F5] px-4 py-2 text-xs sm:text-sm font-medium hover:bg-[#2E3A32] hover:text-[#22C55E] transition text-center"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination for Recommended Users */}
                        {totalRecPages > 1 && (
                            <div className="flex items-center justify-between pt-2 text-xs text-[#8B948F]">
                                <span>
                                    Showing {((recPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(recPage * ITEMS_PER_PAGE, recommendedUsers.length)} of {recommendedUsers.length} recommendations
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setRecPage((p) => Math.max(1, p - 1))}
                                        disabled={recPage === 1}
                                        className="px-3 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] disabled:opacity-40 hover:border-[#22C55E] transition font-medium"
                                    >
                                        Previous
                                    </button>
                                    <span className="font-semibold text-[#F5F7F5]">
                                        {recPage} / {totalRecPages}
                                    </span>
                                    <button
                                        onClick={() => setRecPage((p) => Math.min(totalRecPages, p + 1))}
                                        disabled={recPage === totalRecPages}
                                        className="px-3 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] disabled:opacity-40 hover:border-[#22C55E] transition font-medium"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Rating Modal */}
            <RatingModal
                show={ratingModal.show}
                onClose={() => setRatingModal({ show: false, gameSlug: '', existingReview: null })}
                gameSlug={ratingModal.gameSlug}
                existingReview={ratingModal.existingReview}
            />
            </div>
        </AppLayout>
    );
}