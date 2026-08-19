import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import StoryBar from '@/Components/StoryBar';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ topHits, newGames, myStories = [], followingStoryGroups = [] }) {
    return (
        <AppLayout>
            <Head title="Home" />

            {/* Mobile Only: StoryBar stays on top */}
            <div className="block sm:hidden">
                <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} />
            </div>

            {/* Navigation Header Row */}
            <div className="flex items-center gap-3 sm:gap-4 mb-8 w-full flex-wrap sm:flex-nowrap">
                <span className="flex-1 sm:flex-initial text-center rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-default whitespace-nowrap">
                    Top Hits & New Games
                </span>
                <Link
                    href={route('all-games')}
                    className="flex-1 sm:flex-initial text-center rounded-lg border border-[#1F2923] text-[#8B948F] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition whitespace-nowrap"
                >
                    All Games
                </Link>

                {/* PC & Tablet Only: StoryBar placed directly next to All Games button */}
                <div className="hidden sm:flex items-center shrink-0">
                    <StoryBar myStories={myStories} followingStoryGroups={followingStoryGroups} isInline={true} />
                </div>
            </div>

            <section className="mb-10">
                <h2 className="text-[#F5F7F5] text-xl font-semibold mb-4">Top Hits</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {topHits.map((game) => (
                        <RawgGameCard key={game.external_id} game={game} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-[#F5F7F5] text-xl font-semibold mb-4">New Games</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {newGames.map((game) => (
                        <RawgGameCard key={game.external_id} game={game} />
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}