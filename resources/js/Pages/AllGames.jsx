import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import StoryBar from '@/Components/StoryBar';
import { Head, Link, router } from '@inertiajs/react';

export default function AllGames({
    games,
    currentPage,
    lastPage,
    myStories = [],
    followingStoryGroups = [],
    myListIds = [],
    myListExternalIds = [],
    userReviewCount = 0,
}) {
    const hasReviews = userReviewCount > 0;
    const homeTabTitle = hasReviews ? 'Recommended for You' : 'Top Hits & New Games';

    const goToPage = (page) => {
        router.get(route('all-games'), { page }, { preserveScroll: true });
    };

    const pageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(lastPage, currentPage + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <AppLayout>
            <Head title="All Games" />

            <div className="w-full">
                {/* Navigation Header Row: Tabs + Stories */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 w-full overflow-x-auto scrollbar-none py-0.5">
                    <Link
                        href={route('dashboard')}
                        className="text-center rounded-xl border border-[#1F2923] text-[#8B948F] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition whitespace-nowrap shrink-0"
                    >
                        {homeTabTitle}
                    </Link>
                    <span className="text-center rounded-xl bg-[#22C55E] text-[#0B0F0D] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-default whitespace-nowrap shrink-0">
                        All Games
                    </span>
                    <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} isInline={true} />
                </div>

                <h2 className="text-[#F5F7F5] text-lg sm:text-xl font-semibold mb-3">All Games</h2>

                {/* Responsive Grid: 2 cols (mobile), 3-4 cols (tablet/laptop), 6 cols (PC lg & xl) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4 mb-8">
                    {games.map((game) => (
                        <RawgGameCard
                            key={game.external_id}
                            game={game}
                            isInList={myListExternalIds.includes(game.external_id)}
                        />
                    ))}
                </div>

                    <div className="flex items-center justify-center gap-2 mb-8">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-3 py-1.5 text-sm hover:border-[#2E3A32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>

                        {pageNumbers().map((p) => (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                    p === currentPage
                                        ? 'bg-[#22C55E] text-[#0B0F0D] font-medium'
                                        : 'border border-[#1F2923] text-[#8B948F] hover:border-[#2E3A32]'
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === lastPage}
                            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-3 py-1.5 text-sm hover:border-[#2E3A32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
        </AppLayout>
    );
}