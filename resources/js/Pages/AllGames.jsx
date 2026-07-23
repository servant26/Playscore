import AppLayout from '@/Layouts/AppLayout';
import RawgGameCard from '@/Components/RawgGameCard';
import { Head, Link, router } from '@inertiajs/react';

export default function AllGames({ games, currentPage, lastPage }) {
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

            <div className="flex items-center gap-2 mb-8">
                <Link
                    href={route('dashboard')}
                    className="rounded-lg border border-[#1F2923] text-[#8B948F] px-5 py-2 text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                >
                    Top Hits & New Games
                </Link>
                <span className="rounded-lg bg-[#22C55E] text-[#0B0F0D] px-5 py-2 text-sm font-medium">
                    All Games
                </span>
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