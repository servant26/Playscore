import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';

function CoverSlideshow({ games = [] }) {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (!games || games.length <= 1) return;
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % games.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [games.length]);

    if (!games || games.length === 0) {
        return (
            <div className="w-full h-full bg-[#0E1411]">
                <img
                    src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80"
                    alt="Gaming Showcase"
                    className="w-full h-full object-cover filter brightness-75 contrast-125"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {games.map((g, idx) => (
                <div
                    key={g.image + idx}
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{ opacity: idx === activeSlide ? 1 : 0 }}
                >
                    <img
                        src={g.image}
                        alt={g.title}
                        className="w-full h-full object-cover filter brightness-75 contrast-125"
                    />
                    {/* Dark gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F0D]/80 via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 text-[#F5F7F5] z-10">
                        <span className="bg-[#0B0F0D]/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-[#22C55E] border border-[#1F2923] inline-block mb-2">
                            Trending Game
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold truncate">{g.title}</h3>
                        <p className="text-xs text-[#8B948F] mt-0.5">
                            RAWG Rating: {g.rating ? `${g.rating} / 5.0` : 'Top Rated'}
                        </p>
                    </div>
                </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#0B0F0D]/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-[#1F2923]">
                {games.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            i === activeSlide ? 'bg-[#22C55E]' : 'bg-[#F5F7F5]/30 hover:bg-[#F5F7F5]/60'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function About({ totalGamesCount = '870K+', trendingGames = [] }) {
    const featureItems = [
        {
            title: 'Granular 0.0 – 10.0 Rating System',
            description: 'Evaluate every title on a precise decimal scale for accurate personal logs and authentic community insights without 5-star limitations.',
        },
        {
            title: 'Personal Backlog Management',
            description: 'Organize your gaming journey into Want to Play, Currently Playing, and Completed lists with effortless status tracking.',
        },
        {
            title: 'Reviewer Rank Progression',
            description: 'Build your reputation and unlock prestige rank badges ranging from Novice Reviewer to Platinum Gamer as you contribute critiques.',
        },
        {
            title: 'Social Story Highlights',
            description: 'Share your milestone ratings, review highlights, and rank achievements directly to community story feeds.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F0D]">
            <Head title="About Us - Playscore" />

            {/* Dark Navbar */}
            <PublicNavbar currentRoute="about" variant="dark" />

            {/* Full Screen Height 2-Column Hero Header */}
            <section
                className="relative overflow-hidden border-b border-[#1F2923] flex items-center bg-[#0B0F0D]"
                style={{ minHeight: 'calc(100vh - 64px)' }}
            >
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 w-full py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* LEFT COLUMN: Unique Slogan & Concise Description */}
                        <div className="lg:col-span-6 space-y-5">
                            <span className="text-[#22C55E] text-xs sm:text-sm font-semibold uppercase tracking-wider bg-[#22C55E]/10 px-3.5 py-1.5 rounded-full border border-[#22C55E]/20 inline-block">
                                Platform Overview
                            </span>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7F5] leading-tight">
                                Your Ultimate Gaming Vault & Critique Hub.
                            </h1>

                            <p className="text-[#8B948F] text-base sm:text-lg leading-relaxed">
                                Playscore is a modern gaming platform built for players to log their backlog, rate games on a precise 0–10 scale, and share authentic community reviews. Level up your reviewer rank as you track your journey.
                            </p>

                            <div className="pt-4 border-t border-[#1F2923] grid grid-cols-2 gap-6 text-[#F5F7F5]">
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-[#22C55E]">{totalGamesCount}</p>
                                    <p className="text-xs text-[#8B948F] mt-1 font-medium">Real-time Game Database</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-[#22C55E]">0.0 – 10.0</p>
                                    <p className="text-xs text-[#8B948F] mt-1 font-medium">Decimal Rating Scale</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Dynamic Cover Slideshow of Trending Games */}
                        <div className="lg:col-span-6 relative aspect-[16/10] max-h-[380px] rounded-3xl overflow-hidden border border-[#1F2923] shadow-2xl bg-[#0E1411]">
                            <CoverSlideshow games={trendingGames} />
                        </div>

                    </div>
                </div>
            </section>

            {/* Light Content Body with Compact Spacing */}
            <div className="bg-slate-50 text-slate-900">
                <main className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 space-y-8 sm:space-y-10">
                    {/* Background & Purpose */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                                    Our Background & Purpose
                                </h2>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3">
                                    Playscore was created to address a common problem among gaming enthusiasts: the lack of a modern, uncluttered space to log played games and express detailed opinions beyond simple 5-star ratings.
                                </p>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    Whether you are a casual player wanting to keep track of completed titles or a veteran reviewer crafting in-depth critiques, Playscore offers a streamlined environment designed specifically around your gaming habits.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Why Gamers Choose Playscore
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                    Tailored features built for precision tracking and vibrant community interaction.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-[#16A34A]">{totalGamesCount}</p>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Real-time Game Database</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-[#16A34A]">0.0 – 10.0</p>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Decimal Rating Scale</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Capabilities */}
                    <div className="border-t border-slate-200 pt-8 sm:pt-10">
                        <div className="mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                                Core Platform Capabilities
                            </h2>
                            <p className="text-sm text-slate-600">
                                Everything you need to log, evaluate, and share your gaming journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featureItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#16A34A]/50 transition-all"
                                >
                                    <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Compact Full Width Dark Footer CTA */}
                <section className="w-full bg-[#0B0F0D] border-t border-[#1F2923] py-8 sm:py-10 text-center text-[#F5F7F5]">
                    <div className="max-w-xl mx-auto px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                            Ready to build your gaming profile?
                        </h2>
                        <p className="text-xs sm:text-sm text-[#8B948F] mb-4">
                            Join Playscore today and start logging your gaming journey with precision.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-lg bg-[#22C55E] text-[#0B0F0D] font-semibold px-5 py-2.5 text-xs sm:text-sm hover:bg-[#4ADE80] transition"
                        >
                            Create Account
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
