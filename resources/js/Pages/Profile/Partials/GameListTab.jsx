import GameCard from '@/Components/GameCard';
import { router } from '@inertiajs/react';

export default function GameListTab({ gameList }) {
    const toggleList = (gameId) => {
        router.post(
            route('game-list.toggle', gameId),
            {},
            { preserveScroll: true }
        );
    };

    if (gameList.length === 0) {
        return (
            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center">
                <p className="text-[#8B948F] text-sm">
                    You haven't added any games to your list yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-[#F5F7F5] text-lg font-semibold mb-4">
                My Game List ({gameList.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gameList.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        isInList={true}
                        onToggleList={toggleList}
                    />
                ))}
            </div>
        </div>
    );
}