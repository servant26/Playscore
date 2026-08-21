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

            <div className="w-full">
                {/* Navigation Header Row: Tabs + Stories */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 w-full overflow-x-auto scrollbar-none py-0.5">
                    <span className="text-center rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-default whitespace-nowrap shrink-0">
                        Top Hits & New Games
                    </span>
                    <Link
                        href={route('all-games')}
                        className="text-center rounded-xl border border-[#1F2923] text-[#8B948F] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition whitespace-nowrap shrink-0"
                    >
                        All Games
                    </Link>
                    <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} isInline={true} />
                </div>

                <section className="mb-8">
                    <h2 className="text-[#F5F7F5] text-lg sm:text-xl font-semibold mb-3">Top Hits & New Games</h2>
                        
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
        </AppLayout>
    );
}