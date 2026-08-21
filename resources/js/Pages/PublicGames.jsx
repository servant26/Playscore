import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function PublicGames({ games = [], totalCount = 0, filters = {}, genresList = [] }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [activeGenre, setActiveGenre] = useState(filters.genre || '');
    const [selectedTrailer, setSelectedTrailer] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('games.index'), { search: searchQuery, genre: activeGenre }, { preserveState: true });
    };

    const handleGenreClick = (genre) => {
        const nextGenre = activeGenre === genre ? '' : genre;
        setActiveGenre(nextGenre);
        router.get(route('games.index'), { search: searchQuery, genre: nextGenre }, { preserveState: true });
    };

    const openTrailer = (e, title) => {
        e.stopPropagation();
        const query = encodeURIComponent(`${title} official trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#F5F7F5]">
            <Head title="Games Catalog - Playscore" />

            {/* Navbar */}
            <PublicNavbar currentRoute="games.index" />

            {/* Header Section */}
            <div className="border-b border-[#1F2923] bg-[#0E1411]">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
                    <div className="max-w-3xl">
                        <span className="text-[#22C55E] text-xs font-bold uppercase tracking-wider bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20 inline-block mb-3">
                            Catalog & Discovery
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F7F5] mb-4">
                            Explore Games Catalog
                        </h1>
                        <p className="text-[#8B948F] text-base leading-relaxed mb-8">
                            Discover popular releases, retro classics, and trending titles. Filter by genre or search for your favorite games.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative max-w-xl">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games by title..."
                                className="w-full bg-[#161F1A] border border-[#1F2923] text-[#F5F7F5] placeholder-[#8B948F] px-4 py-3.5 pl-11 rounded-xl focus:outline-none focus:border-[#22C55E] transition text-sm"
                            />
                            <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B948F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#22C55E] text-[#0B0F0D] font-semibold px-4 py-1.5 rounded-lg text-xs hover:bg-[#4ADE80] transition"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Genre Filters */}
                    <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <span className="text-xs font-medium text-[#8B948F] mr-2 shrink-0">Genres:</span>
                        <button
                            onClick={() => handleGenreClick('')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                                activeGenre === ''
                                    ? 'bg-[#22C55E] text-[#0B0F0D] font-semibold'
                                    : 'bg-[#161F1A] text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                            }`}
                        >
                            All
                        </button>
                        {genresList.map((g) => (
                            <button
                                key={g}
                                onClick={() => handleGenreClick(g)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                                    activeGenre === g
                                        ? 'bg-[#22C55E] text-[#0B0F0D] font-semibold'
                                        : 'bg-[#161F1A] text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <main className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-[#F5F7F5]">
                            {filters.search ? `Search results for "${filters.search}"` : 'Popular & Trending Games'}
                        </h2>
                        <p className="text-xs text-[#8B948F] mt-1">
                            Showing catalog games
                        </p>
                    </div>
                </div>

                {games.length === 0 ? (
                    <div className="text-center py-20 bg-[#0E1411] border border-[#1F2923] rounded-2xl">
                        <span className="text-4xl mb-3 block">🎮</span>
                        <h3 className="text-lg font-semibold text-[#F5F7F5] mb-1">No games found</h3>
                        <p className="text-sm text-[#8B948F]">Try searching for another keyword or genre filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {games.map((game) => (
                            <div
                                key={game.external_id}
                                className="group bg-[#0E1411] border border-[#1F2923] rounded-2xl overflow-hidden hover:border-[#22C55E]/50 transition-all duration-300 flex flex-col"
                            >
                                {/* Cover Image Container */}
                                <div className="relative aspect-[16/9] overflow-hidden bg-[#161F1A]">
                                    <img
                                        src={game.cover_url}
                                        alt={game.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1411] via-transparent to-transparent opacity-80" />

                                    {/* Rating Badge */}
                                    <div className="absolute top-3 right-3 bg-[#0B0F0D]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#1F2923] flex items-center gap-1.5">
                                        <span className="text-yellow-400 text-xs">⭐</span>
                                        <span className="text-xs font-bold text-[#F5F7F5]">{game.rawg_rating || 'N/A'}</span>
                                    </div>

                                    {/* Released Year */}
                                    <div className="absolute top-3 left-3 bg-[#0B0F0D]/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-[#8B948F]">
                                        {game.released}
                                    </div>

                                    {/* Trailer Overlay Button */}
                                    <button
                                        onClick={(e) => openTrailer(e, game.title)}
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B0F0D]/50"
                                    >
                                        <span className="bg-[#22C55E] text-[#0B0F0D] font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            ▶ Watch Trailer
                                        </span>
                                    </button>
                                </div>

                                {/* Details Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#F5F7F5] group-hover:text-[#22C55E] transition-colors line-clamp-1 mb-1">
                                            {game.title}
                                        </h3>
                                        <p className="text-xs text-[#8B948F] mb-3 line-clamp-1">
                                            {game.genres}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[#1F2923]/60 flex items-center justify-between text-[11px] text-[#8B948F]">
                                        <span className="truncate max-w-[180px]">{game.platforms || 'PC, Console'}</span>
                                        <Link
                                            href={route('register')}
                                            className="text-[#22C55E] hover:underline font-medium shrink-0"
                                        >
                                            Rate +
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Call to action section */}
                <div className="mt-16 bg-gradient-to-r from-[#16271C] to-[#0E1411] border border-[#22C55E]/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
                    <div className="max-w-2xl mx-auto relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7F5] mb-3">
                            Want to log games & publish reviews?
                        </h2>
                        <p className="text-sm text-[#8B948F] mb-6">
                            Join Playscore for free to create custom backlog lists, rate every game you play with precise 0-10 scores, and share your stats.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold px-7 py-3 text-sm hover:bg-[#4ADE80] transition shadow-lg shadow-[#22C55E]/20"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
