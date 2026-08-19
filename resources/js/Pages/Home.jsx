import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import StoryBar from '@/Components/StoryBar';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ topHits = [], newGames = [], myStories = [], followingStoryGroups = [], myListIds = [], myListExternalIds = [] }) {
    // Combine topHits and newGames into a single pool of 9 unique games
    const combinedGames = [...topHits, ...newGames]
        .reduce((acc, current) => {
            const exists = acc.some((item) => item.external_id === current.external_id);
            if (!exists) acc.push(current);
            return acc;
        }, [])
        .slice(0, 9);

    return (
        <AppLayout>
            <Head title="Home" />

            {/* Mobile Only: StoryBar stays on top */}
            <div className="block sm:hidden">
                <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
                {/* PC & Tablet LEFT Sidebar: Shifted to the Left margin */}
                <aside className="hidden sm:flex flex-col items-center w-16 shrink-0 sticky top-24 self-start -ml-6 sm:-ml-10 lg:-ml-12">
                    <span className="text-[11px] font-bold text-[#8B948F] uppercase tracking-wider mb-3 text-center whitespace-nowrap">
                        Stories
                    </span>
                    <StoryBar
                        myStories={myStories}
                        followingStoryGroups={followingStoryGroups}
                        isVertical={true}
                    />
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {/* Navigation Header Row */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full flex-wrap sm:flex-nowrap">
                        <span className="flex-1 sm:flex-initial text-center rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-default whitespace-nowrap">
                            Top Hits & New Games
                        </span>
                        <Link
                            href={route('all-games')}
                            className="flex-1 sm:flex-initial text-center rounded-lg border border-[#1F2923] text-[#8B948F] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition whitespace-nowrap"
                        >
                            All Games
                        </Link>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-[#F5F7F5] text-xl font-semibold mb-4">Top Hits & New Games</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {combinedGames.map((game) => (
                                <RawgGameCard
                                    key={game.external_id}
                                    game={game}
                                    isInList={myListExternalIds.includes(game.external_id)}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}