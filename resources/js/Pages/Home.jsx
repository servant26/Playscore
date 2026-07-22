import AppLayout from '@/Layouts/AppLayout';
import GameCard from '@/Components/GameCard';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ topHits, newGames, myListIds }) {
    const [listIds, setListIds] = useState(myListIds || []);

    const toggleList = (gameId, gameSlug) => {
        const isInList = listIds.includes(gameId);

        setListIds((prev) =>
            isInList ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        );

        router.post(
            route('game-list.toggle', gameSlug),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <AppLayout>
            <Head title="Home" />

            <section className="mb-10">
                <h2 className="text-[#F5F7F5] text-xl font-semibold mb-4">Top Hits</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {topHits.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            isInList={listIds.includes(game.id)}
                            onToggleList={toggleList}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-[#F5F7F5] text-xl font-semibold mb-4">New Games</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {newGames.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            isInList={listIds.includes(game.id)}
                            onToggleList={toggleList}
                        />
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}