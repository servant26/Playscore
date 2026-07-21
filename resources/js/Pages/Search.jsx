import AppLayout from '@/Layouts/AppLayout';
import GameCard from '@/Components/GameCard';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Search({ query, games, myListIds }) {
    const [listIds, setListIds] = useState(myListIds || []);

    const toggleList = (gameId) => {
        const isInList = listIds.includes(gameId);

        setListIds((prev) =>
            isInList ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        );

        router.post(
            route('game-list.toggle', gameId),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <AppLayout>
            <Head title={`Search: ${query}`} />

            <h2 className="text-[#F5F7F5] text-xl font-semibold mb-6">
                Search results for "{query}"
            </h2>

            {games.length === 0 ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-16 text-center">
                    <p className="text-[#F5F7F5] text-lg font-medium mb-2">
                        Not Found
                    </p>
                    <p className="text-[#8B948F] text-sm">
                        We couldn't find any games matching "{query}". Try a different keyword.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {games.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            isInList={listIds.includes(game.id)}
                            onToggleList={toggleList}
                        />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}