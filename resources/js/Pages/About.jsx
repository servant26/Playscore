import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

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
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1 sm:gap-1.5 bg-[#0B0F0D]/70 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full border border-[#1F2923]">
                {games.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
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

            {/* Responsive Full Screen Height Hero Header */}
            <section
                className="relative overflow-hidden border-b border-[#1F2923] flex items-center bg-[#0B0F0D] py-6 sm:py-10 lg:py-0"
                style={{ minHeight: 'calc(100vh - 64px)' }}
            >
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 w-full py-4 sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                        
                        {/* LEFT COLUMN: Unique Slogan & Concise Description */}
                        <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left md:text-center lg:text-left">
                            <div>
                                <span className="text-[#22C55E] text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider bg-[#22C55E]/10 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#22C55E]/20 inline-block">
                                    Platform Overview
                                </span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7F5] leading-tight sm:leading-tight lg:leading-tight max-w-2xl md:mx-auto lg:mx-0">
                                Your Ultimate Gaming Vault & Critique Hub.
                            </h1>

                            <p className="text-[#8B948F] text-xs sm:text-base lg:text-lg leading-relaxed max-w-2xl md:mx-auto lg:mx-0">
                                Playscore is a modern gaming platform built for players to log their backlog, rate games on a precise 0–10 scale, and share authentic community reviews. Level up your reviewer rank as you track your journey.
                            </p>

                            <div className="pt-3 sm:pt-4 border-t border-[#1F2923] grid grid-cols-2 gap-4 sm:gap-6 text-[#F5F7F5] max-w-xl md:mx-auto lg:mx-0">
                                <div>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#22C55E]">{totalGamesCount}</p>
                                    <p className="text-[11px] sm:text-xs text-[#8B948F] mt-0.5 sm:mt-1 font-medium">Real-time Game Database</p>
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#22C55E]">0.0 – 10.0</p>
                                    <p className="text-[11px] sm:text-xs text-[#8B948F] mt-0.5 sm:mt-1 font-medium">Decimal Rating Scale</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Dynamic Cover Slideshow of Trending Games */}
                        <div className="lg:col-span-6 relative aspect-[16/10] w-full max-h-[260px] sm:max-h-[320px] lg:max-h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1F2923] shadow-2xl bg-[#0E1411] md:mx-auto max-w-2xl lg:max-w-none">
                            <CoverSlideshow games={trendingGames} />
                        </div>

                    </div>
                </div>
            </section>

            {/* Clean Modern White/Light Content Body */}
            <div className="bg-[#F8FAFC] text-slate-900 border-t border-[#1F2923]">
                {/* 1. Background & Mission Section */}
                <section className="py-14 sm:py-20 border-b border-slate-200">
                    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                            {/* Mission Card */}
                            <div className="lg:col-span-7 space-y-5">
                                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                                    Built by Gamers, for Players Who Take Every Quest Seriously.
                                </h2>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    Playscore was born out of frustration with rigid 5-star ratings and cluttered forums. We wanted a clean, fast, and authentic space where every game in your backlog actually counts, and every review helps someone decide what to experience next.
                                </p>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    Whether you want to document your 100-hour RPG odyssey, rate a cozy weekend indie gem, or showcase your gamer rank, Playscore provides the exact tools you need without corporate fluff or sponsored bias.
                                </p>

                                {/* Highlights grid */}
                                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#16A34A]/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">Zero Rating Inflation</h4>
                                        <p className="text-xs text-slate-500">Unbiased community scores with decimal precision from 0.0 to 10.0.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#16A34A]/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">Verified Gamer Identity</h4>
                                        <p className="text-xs text-slate-500">Earn rank badges from Novice to Platinum based on genuine critiques.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Gamer Values Card */}
                            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <div className="space-y-5">
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <span>🎮</span> What Powers Playscore
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#16A34A]/60 hover:bg-white transition-all duration-300">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-semibold text-slate-900">Database Coverage</span>
                                                <span className="text-xs font-bold text-[#16A34A]">{totalGamesCount}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">Direct synchronization with RAWG API covers retro classics to upcoming AAA releases.</p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#16A34A]/60 hover:bg-white transition-all duration-300">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-semibold text-slate-900">Social Story Engine</span>
                                                <span className="text-xs font-bold text-[#16A34A]">24h Active</span>
                                            </div>
                                            <p className="text-xs text-slate-500">Share your latest gaming moments and game list additions like modern social stories.</p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#16A34A]/60 hover:bg-white transition-all duration-300">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-semibold text-slate-900">Clean & Ad-Free UX</span>
                                                <span className="text-xs font-bold text-[#16A34A]">100% Free</span>
                                            </div>
                                            <p className="text-xs text-slate-500">No intrusive pop-ups, autoplay videos, or clickbait sponsor banners.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Core Capabilities Pillar Grid */}
                <section className="py-14 sm:py-20">
                    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
                                Everything You Need for Your Gaming Vault
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                Explore the specialized features tailored specifically for game lovers, critics, and collectors.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                            {featureItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#16A34A]/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <span className="w-10 h-10 rounded-xl bg-[#16A34A]/10 text-[#16A34A] font-extrabold text-sm flex items-center justify-center mb-4">
                                            0{idx + 1}
                                        </span>
                                        <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Same Global Public Footer as Home, Reviews & News */}
            <PublicFooter />
        </div>
    );
}
