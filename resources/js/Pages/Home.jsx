import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import StoryBar from '@/Components/StoryBar';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ topHits = [], newGames = [], myStories = [], followingStoryGroups = [], myListIds = [], myListExternalIds = [] }) {
    // Combine topHits and newGames into a single pool of unique games
    const combinedGames = [...topHits, ...newGames]
        .reduce((acc, current) => {
            const exists = acc.some((item) => item.external_id === current.external_id);
            if (!exists) acc.push(current);
            return acc;
        }, [])
        .slice(0, 9);

    const tabletAndMobileGames = combinedGames.slice(0, 8);

    return (
        <AppLayout>
            <Head title="Home" />

            {/* Mobile Only (< sm): StoryBar stays on top */}
            <div className="block sm:hidden mb-6">
                <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
                {/* PC Only (lg:): Unclipped full w-16 circles with 100% equal left & right gaps */}
                <aside className="hidden lg:flex flex-col items-center w-16 shrink-0 sticky top-24 self-start lg:-ml-8">
                    <span className="text-[10px] font-bold text-[#8B948F] uppercase tracking-wider mb-2 text-center whitespace-nowrap">
                        Stories
                    </span>
                    <StoryBar
                        myStories={myStories}
                        followingStoryGroups={followingStoryGroups}
                        isVertical={true}
                    />
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 w-full">
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

                        {/* iPad / Tablet Only (sm: to lg:): Stories placed inline next to buttons */}
                        <div className="hidden sm:flex lg:hidden items-center shrink-0">
                            <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} isInline={true} />
                        </div>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-[#F5F7F5] text-xl font-semibold mb-4">Top Hits & New Games</h2>
                        
                        {/* PC Grid (lg:): Displays 9 games (3 columns x 3 rows) */}
                        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                            {combinedGames.map((game) => (
                                <RawgGameCard
                                    key={game.external_id}
                                    game={game}
                                    isInList={myListExternalIds.includes(game.external_id)}
                                />
                            ))}
                        </div>

                        {/* Tablet & Mobile Grid (< lg): Displays 8 games (2 columns x 4 rows) */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6">
                            {tabletAndMobileGames.map((game) => (
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