import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import StoryBar from '@/Components/StoryBar';
import { Head, Link, router } from '@inertiajs/react';

export default function AllGames({ games, currentPage, lastPage, myStories = [], followingStoryGroups = [] }) {
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

            {/* Mobile Only: StoryBar stays on top */}
            <div className="block sm:hidden">
                <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} />
            </div>

            {/* Navigation Header Row */}
            <div className="flex items-center gap-3 sm:gap-4 mb-8 w-full flex-wrap sm:flex-nowrap">
                <Link
                    href={route('dashboard')}
                    className="flex-1 sm:flex-initial text-center rounded-lg border border-[#1F2923] text-[#8B948F] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition whitespace-nowrap"
                >
                    Top Hits & New Games
                </Link>
                <span className="flex-1 sm:flex-initial text-center rounded-lg bg-[#22C55E] text-[#0B0F0D] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-default whitespace-nowrap">
                    All Games
                </span>

                {/* PC & Tablet Only: StoryBar placed directly next to All Games button */}
                <div className="hidden sm:flex items-center shrink-0">
                    <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} isInline={true} />
                </div>
            </div>

            <h2 className="text-[#F5F7F5] text-xl font-semibold mb-6">All Games</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {games.map((game) => (
                    <RawgGameCard key={game.external_id} game={game} />
                ))}
            </div>

            <div className="flex items-center justify-center gap-2">
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
                        className={`rounded-lg px-3 py-1.5 text-sm transition ${p === currentPage
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
        </AppLayout>
    );
}