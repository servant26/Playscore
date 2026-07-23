import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import { Head } from '@inertiajs/react';

export default function Search({ query, games }) {
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
                        <RawgGameCard key={game.external_id} game={game} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}