import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function Leaderboard({ topUsers = [], topGames = [] }) {
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'games'

    const topThreeUsers = topUsers.slice(0, 3);
    const remainingUsers = topUsers.slice(3);

    const topThreeGames = topGames.slice(0, 3);
    const remainingGames = topGames.slice(3);

    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#F5F7F5]">
            <Head title="Leaderboard - Playscore" />

            {/* Navbar */}
            <PublicNavbar currentRoute="leaderboard" />

            {/* Header */}
            <div className="border-b border-[#1F2923] bg-[#0E1411]">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12 text-center">
                    <span className="text-[#22C55E] text-xs font-bold uppercase tracking-wider bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20 inline-block mb-3">
                        Community Hall of Fame
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F7F5] mb-4">
                        Playscore Leaderboard
                    </h1>
                    <p className="text-[#8B948F] text-base max-w-xl mx-auto mb-8">
                        Celebrate top gamers, prolific reviewers, and highest rated games across the entire Playscore ecosystem.
                    </p>

                    {/* Tab Switcher */}
                    <div className="inline-flex p-1 bg-[#161F1A] border border-[#1F2923] rounded-xl">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                                activeTab === 'users'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                        >
                            <span>👑 Top Gamers</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('games')}
                            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                                activeTab === 'games'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                        >
                            <span>⭐ Highest Rated Games</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
                {activeTab === 'users' && (
                    <div>
                        {/* Top 3 Podium Cards */}
                        {topThreeUsers.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                                {/* 2nd Place */}
                                {topThreeUsers[1] && (
                                    <div className="order-2 md:order-1 bg-[#0E1411] border border-[#94A3B8]/30 rounded-2xl p-6 text-center relative overflow-hidden transform hover:-translate-y-1 transition duration-300">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#94A3B8] text-[#0B0F0D] text-[10px] font-bold uppercase px-3 py-0.5 rounded-b-md">
                                            2nd Place 🥈
                                        </div>
                                        <div className="w-20 h-20 mx-auto mt-4 mb-3 rounded-full bg-[#161F1A] p-1 border-2 border-[#94A3B8] overflow-hidden">
                                            <img
                                                src={topThreeUsers[1].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topThreeUsers[1].name}`}
                                                alt={topThreeUsers[1].name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg text-[#F5F7F5]">{topThreeUsers[1].name}</h3>
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1" style={{ color: topThreeUsers[1].rank_color, backgroundColor: `${topThreeUsers[1].rank_color}15` }}>
                                            {topThreeUsers[1].rank_badge} {topThreeUsers[1].rank_title}
                                        </span>
                                        <div className="mt-4 pt-4 border-t border-[#1F2923] flex justify-around text-xs text-[#8B948F]">
                                            <div>
                                                <p className="font-bold text-[#F5F7F5]">{topThreeUsers[1].reviews_count}</p>
                                                <p className="text-[10px]">Reviews</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#22C55E]">{topThreeUsers[1].score}</p>
                                                <p className="text-[10px]">Points</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 1st Place (Gold Podium - Elevated) */}
                                {topThreeUsers[0] && (
                                    <div className="order-1 md:order-2 bg-gradient-to-b from-[#1A261E] to-[#0E1411] border-2 border-[#FACC15] rounded-2xl p-8 text-center relative overflow-hidden transform md:-translate-y-4 shadow-xl shadow-[#FACC15]/10">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#FACC15] text-[#0B0F0D] text-[11px] font-extrabold uppercase px-4 py-1 rounded-b-md">
                                            1st Champion 🥇
                                        </div>
                                        <div className="w-24 h-24 mx-auto mt-4 mb-3 rounded-full bg-[#161F1A] p-1.5 border-2 border-[#FACC15] shadow-lg shadow-[#FACC15]/20 overflow-hidden relative">
                                            <img
                                                src={topThreeUsers[0].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topThreeUsers[0].name}`}
                                                alt={topThreeUsers[0].name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="font-extrabold text-xl text-[#F5F7F5]">{topThreeUsers[0].name}</h3>
                                        <span className="text-xs font-bold px-3 py-1 rounded-full inline-block mt-1 bg-[#FACC15]/15 text-[#FACC15]">
                                            {topThreeUsers[0].rank_badge} {topThreeUsers[0].rank_title}
                                        </span>
                                        <div className="mt-5 pt-4 border-t border-[#1F2923] flex justify-around text-xs text-[#8B948F]">
                                            <div>
                                                <p className="font-bold text-base text-[#F5F7F5]">{topThreeUsers[0].reviews_count}</p>
                                                <p className="text-[10px]">Reviews</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-base text-[#22C55E]">{topThreeUsers[0].score}</p>
                                                <p className="text-[10px]">Score Points</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 3rd Place */}
                                {topThreeUsers[2] && (
                                    <div className="order-3 bg-[#0E1411] border border-[#F59E0B]/30 rounded-2xl p-6 text-center relative overflow-hidden transform hover:-translate-y-1 transition duration-300">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0B0F0D] text-[10px] font-bold uppercase px-3 py-0.5 rounded-b-md">
                                            3rd Place 🥉
                                        </div>
                                        <div className="w-20 h-20 mx-auto mt-4 mb-3 rounded-full bg-[#161F1A] p-1 border-2 border-[#F59E0B] overflow-hidden">
                                            <img
                                                src={topThreeUsers[2].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topThreeUsers[2].name}`}
                                                alt={topThreeUsers[2].name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg text-[#F5F7F5]">{topThreeUsers[2].name}</h3>
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1" style={{ color: topThreeUsers[2].rank_color, backgroundColor: `${topThreeUsers[2].rank_color}15` }}>
                                            {topThreeUsers[2].rank_badge} {topThreeUsers[2].rank_title}
                                        </span>
                                        <div className="mt-4 pt-4 border-t border-[#1F2923] flex justify-around text-xs text-[#8B948F]">
                                            <div>
                                                <p className="font-bold text-[#F5F7F5]">{topThreeUsers[2].reviews_count}</p>
                                                <p className="text-[10px]">Reviews</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#22C55E]">{topThreeUsers[2].score}</p>
                                                <p className="text-[10px]">Points</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Ranks 4+ Table */}
                        {remainingUsers.length > 0 && (
                            <div className="bg-[#0E1411] border border-[#1F2923] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#1F2923]">
                                    <h3 className="font-bold text-[#F5F7F5]">Runner-ups & Active Reviewers</h3>
                                </div>
                                <div className="divide-y divide-[#1F2923]">
                                    {remainingUsers.map((usr, idx) => (
                                        <div key={usr.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#161F1A] transition">
                                            <div className="flex items-center gap-4">
                                                <span className="w-6 text-center font-bold text-sm text-[#8B948F]">
                                                    #{idx + 4}
                                                </span>
                                                <img
                                                    src={usr.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${usr.name}`}
                                                    alt={usr.name}
                                                    className="w-10 h-10 rounded-full object-cover bg-[#161F1A]"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-sm text-[#F5F7F5]">{usr.name}</h4>
                                                    <p className="text-xs text-[#8B948F]">
                                                        {usr.rank_badge} {usr.rank_title}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-[#22C55E] block">{usr.score} pts</span>
                                                <span className="text-xs text-[#8B948F]">{usr.reviews_count} reviews</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'games' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topGames.map((game, idx) => (
                            <div
                                key={game.id}
                                className="bg-[#0E1411] border border-[#1F2923] rounded-2xl p-5 flex items-center gap-5 hover:border-[#22C55E]/40 transition"
                            >
                                <div className="text-xl font-black text-[#22C55E] w-8 text-center shrink-0">
                                    #{idx + 1}
                                </div>
                                <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#161F1A] shrink-0">
                                    <img
                                        src={game.cover_url}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base text-[#F5F7F5] truncate mb-1">{game.title}</h3>
                                    <p className="text-xs text-[#8B948F] mb-3">{game.genres}</p>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border border-[#22C55E]/20">
                                            ⭐ {game.rating} / 10
                                        </span>
                                        <span className="text-[#8B948F]">
                                            {game.reviews_count} community reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
