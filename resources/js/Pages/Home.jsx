import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ topHits, newGames }) {
    return (
        <AppLayout>
            <Head title="Home" />

            <div className="flex items-center gap-2 mb-8">
                <span className="rounded-lg bg-[#22C55E] text-[#0B0F0D] px-5 py-2 text-sm font-medium">
                    Top Hits & New Games
                </span>
                <Link
                    href={route('all-games')}
                    className="rounded-lg border border-[#1F2923] text-[#8B948F] px-5 py-2 text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                >
                    All Games
                </Link>
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