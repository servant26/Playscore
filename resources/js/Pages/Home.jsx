import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import Pagination from '@/Components/Pagination';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getFallbackImage } from '@/Utils/imageFallback';

export default function Dashboard({
    heroGames = [],
    tabGames = [],
    currentTab = 'all',
    currentPage = 1,
    lastPage = 1,
    perPage = 8,
    myListIds = [],
    myListExternalIds = [],
}) {
    const [hoveredGame, setHoveredGame] = useState(null);
    const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);

    // List management state
    const [listExternalIds, setListExternalIds] = useState(myListExternalIds || []);
    const [confirmModalGame, setConfirmModalGame] = useState(null);

    // Device responsive per_page calculation:
    // Mobile (<768px): 10 items (2 cols x 5 rows)
    // Tablet (>=768px and <1024px): 9 items (3 cols x 3 rows)
    // Desktop (>=1024px): 8 items (4 cols x 2 rows)
    const getDevicePerPage = () => {
        if (typeof window === 'undefined') return 8;
        const width = window.innerWidth;
        if (width < 768) return 10;
        if (width < 1024) return 9;
        return 8;
    };

    // Auto synchronize per_page on mount if initial load doesn't match client viewport
    useEffect(() => {
        const expectedPerPage = getDevicePerPage();
        if (perPage !== expectedPerPage) {
            router.get(
                route('dashboard'),
                { tab: currentTab, page: 1, per_page: expectedPerPage },
                { preserveScroll: true, preserveState: true, replace: true }
            );
        }
    }, []);

    // Tab items: All Games, Popular, New Games, For You
    const tabs = [
        { key: 'all', label: 'All Games' },
        { key: 'popular', label: 'Popular' },
        { key: 'new', label: 'New Games' },
        { key: 'for-you', label: 'For You' },
    ];

    // Active Hero Game (Follows hovered card, fallback to first heroGame)
    const featuredGame = hoveredGame || heroGames[0] || tabGames[0] || null;

    const handleHoverGame = (game) => {
        if (!game || game.external_id === hoveredGame?.external_id) return;
        setIsHeroTransitioning(true);
        setTimeout(() => {
            setHoveredGame(game);
            setIsHeroTransitioning(false);
        }, 150);
    };

    const handleTabChange = (tabKey) => {
        setHoveredGame(null);
        router.get(
            route('dashboard'),
            { tab: tabKey, page: 1, per_page: getDevicePerPage() },
            { preserveScroll: true, preserveState: true }
        );
    };

    const goToPage = (pageNumber) => {
        setHoveredGame(null);
        router.get(
            route('dashboard'),
            { tab: currentTab, page: pageNumber, per_page: getDevicePerPage() },
            { preserveScroll: true, preserveState: true }
        );
    };

    const openTrailer = (e, gameTitle) => {
        e.stopPropagation();
        const query = encodeURIComponent(`${gameTitle} official game trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const goToDetail = (game) => {
        if (game?.external_id) {
            router.get(route('games.import-and-show', game.external_id));
        }
    };

    const handleToggleList = (e, game) => {
        e.stopPropagation();
        const isIn = listExternalIds.includes(game.external_id);
        if (isIn) {
            setConfirmModalGame(game);
        } else {
            // Add immediately in UI state
            setListExternalIds((prev) => [...prev, game.external_id]);
            router.post(
                route('game-list.toggle', game.external_id),
                {},
                { preserveScroll: true, preserveState: true, only: ['myListExternalIds', 'myListIds'] }
            );
        }
    };

    const handleConfirmRemove = () => {
        if (confirmModalGame) {
            setListExternalIds((prev) => prev.filter((id) => id !== confirmModalGame.external_id));
            router.post(
                route('game-list.toggle', confirmModalGame.external_id),
                {},
                { preserveScroll: true, preserveState: true, only: ['myListExternalIds', 'myListIds'] }
            );
            setConfirmModalGame(null);
        }
    };

    const pageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(lastPage, currentPage + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const heroImage = featuredGame?.cover_url || (featuredGame?.title ? getFallbackImage(featuredGame.title) : '');

    return (
        <AppLayout>
            <Head title="Home - Playscore" />

            <div className="w-full space-y-6 sm:space-y-8 pb-12 pt-1">

                {/* Hero Showcase Banner */}
                {featuredGame && (
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#131916] border border-[#1F2923] shadow-2xl min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] flex items-end">
                        {/* Background Banner Image with Fade Transition on Hover */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <div
                                key={featuredGame.external_id}
                                className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
                                    isHeroTransitioning ? 'opacity-20 scale-105' : 'opacity-100 scale-100'
                                }`}
                                style={{
                                    backgroundImage: `url("${heroImage}")`,
                                    filter: 'brightness(0.85) contrast(1.05)',
                                }}
                            />

                            {/* Vignette & Gradient Overlays for High Contrast Text */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/60 to-transparent z-[1]" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F0D]/95 via-[#0B0F0D]/40 to-transparent z-[1]" />
                        </div>

                        {/* Top Badges (Rating Star only) */}
                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2">
                            {featuredGame.rawg_rating && (
                                <span className="inline-flex items-center gap-1 bg-[#0B0F0D]/80 border border-[#1F2923] backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#22C55E] shadow-lg">
                                    ★ {Number(featuredGame.rawg_rating).toFixed(1)}
                                </span>
                            )}
                        </div>

                        {/* Hero Content Information (Bottom-Left) */}
                        <div
                            className={`relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl w-full transition-all duration-300 transform ${
                                isHeroTransitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
                            }`}
                        >
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] line-clamp-2">
                                {featuredGame.title}
                            </h1>

                            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D1D5DB] mb-5 sm:mb-6 font-medium drop-shadow-md">
                                <span className="text-[#22C55E] font-semibold">{featuredGame.genres || 'Action, Adventure'}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={(e) => openTrailer(e, featuredGame.title)}
                                    className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-bold text-xs sm:text-sm transition"
                                >
                                    Watch Trailer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goToDetail(featuredGame)}
                                    className="px-5 py-2.5 rounded-xl bg-[#131916]/80 hover:bg-[#1F2923] border border-[#1F2923] text-[#F5F7F5] font-semibold text-xs sm:text-sm backdrop-blur-md transition"
                                >
                                    Game Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Menus Row: All Games, Popular, New Games, For You */}
                <div>
                    <div className="flex items-center justify-between border-b border-[#1F2923] pb-3 overflow-x-auto scrollbar-none gap-4">
                        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                            {tabs.map((tab) => {
                                const isActive = currentTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => handleTabChange(tab.key)}
                                        className={`relative pb-3 text-sm sm:text-base font-semibold transition-colors shrink-0 ${
                                            isActive ? 'text-white' : 'text-[#8B948F] hover:text-[#F5F7F5]'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#22C55E] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Responsive Stream-Card Grid:
                        - Mobile: 2 columns (grid-cols-2), 10 items/page (2 cols x 5 rows)
                        - Tablet: 3 columns (md:grid-cols-3), 9 items/page (3 cols x 3 rows)
                        - PC/Desktop: 4 columns (lg:grid-cols-4), 8 items/page (4 cols x 2 rows)
                    */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 pt-6 mb-8">
                        {tabGames.map((game) => {
                            const cover = game.cover_url || getFallbackImage(game.title);
                            const isInList = listExternalIds.includes(game.external_id);
                            const isHovered = featuredGame?.external_id === game.external_id;

                            return (
                                <div
                                    key={game.external_id}
                                    onMouseEnter={() => handleHoverGame(game)}
                                    onTouchStart={() => handleHoverGame(game)}
                                    onClick={() => goToDetail(game)}
                                    className={`group cursor-pointer flex flex-col bg-[#131916] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border ${
                                        isHovered
                                            ? 'border-[#22C55E] shadow-[0_0_18px_rgba(34,197,94,0.35)]'
                                            : 'border-[#1F2923] hover:border-[#22C55E]/60'
                                    }`}
                                >
                                    {/* 16:9 Thumbnail Image */}
                                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B0F0D]">
                                        <img
                                            src={cover}
                                            alt={game.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = getFallbackImage(game.title);
                                            }}
                                            loading="lazy"
                                        />

                                        {/* Top Left Badge: Score / Rating */}
                                        {game.rawg_rating && (
                                            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 rounded-md text-[10px] sm:text-[11px] font-semibold text-[#F5F7F5] flex items-center gap-1 shadow">
                                                <span className="text-[#22C55E]">★</span>
                                                <span>{Number(game.rawg_rating).toFixed(1)}</span>
                                            </div>
                                        )}

                                        {/* Top Right Badge: POPULAR (Only for truly popular games) */}
                                        {(game.is_popular || (Number(game.rawg_rating) >= 4.2)) && (
                                            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-[#EF4444] px-1.5 py-0.5 sm:px-2 rounded-md text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                <span>Popular</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Metadata & Footer Row */}
                                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                                        <h3 className={`font-bold text-xs sm:text-sm lg:text-base transition line-clamp-1 mb-1.5 sm:mb-2 ${
                                            isHovered ? 'text-[#22C55E]' : 'text-[#F5F7F5] group-hover:text-[#22C55E]'
                                        }`}>
                                            {game.title}
                                        </h3>

                                        <div className="flex items-center justify-between pt-2 border-t border-[#1F2923]/60 text-xs text-[#8B948F] gap-1.5 sm:gap-2">
                                            {/* Full Genres list */}
                                            <span className="truncate text-[10px] sm:text-[11px] lg:text-xs font-medium text-[#D1D5DB] flex-1" title={game.genres || 'Action'}>
                                                {game.genres || 'Action'}
                                            </span>

                                            {/* In List / Add List Action Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => handleToggleList(e, game)}
                                                className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0 transition ${
                                                    isInList
                                                        ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40 hover:bg-[#DC2626]/15 hover:text-[#EF4444] hover:border-[#DC2626]/40'
                                                        : 'bg-[#1F2923] text-[#8B948F] border border-[#2E3A32] hover:text-[#F5F7F5] hover:border-[#22C55E]/50'
                                                }`}
                                            >
                                                {isInList ? 'In List' : '+ Add List'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Responsive Pagination Controls */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={lastPage}
                        onPageChange={goToPage}
                        className="mt-4"
                    />
                </div>
            </div>

            {/* Remove from list confirmation modal */}
            <ConfirmModal
                show={!!confirmModalGame}
                title="Remove from List"
                message={`Are you sure you want to remove "${confirmModalGame?.title}" from your list?`}
                onConfirm={handleConfirmRemove}
                onCancel={() => setConfirmModalGame(null)}
                confirmText="Remove"
                variant="danger"
            />
        </AppLayout>
    );
}