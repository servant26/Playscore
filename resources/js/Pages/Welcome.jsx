import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';

function HeroBackground({ images }) {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) return null;

    return (
        <>
            {images.map((img, i) => (
                <div
                    key={img}
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                        opacity: i === activeSlide ? 1 : 0,
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(4px)',
                        transform: 'scale(1.1)',
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-[#0B0F0D]/70" />

            {images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSlide(i)}
                            className={`h-1.5 rounded-full transition-all ${i === activeSlide
                                ? 'w-6 bg-[#22C55E]'
                                : 'w-1.5 bg-[#F5F7F5]/40 hover:bg-[#F5F7F5]/60'
                                }`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default function Welcome({ canLogin, canRegister, previewGames, totalGamesCount }) {
    const [activeStep, setActiveStep] = useState(0);
    const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

    const features = [
        {
            icon: '🎮',
            title: 'Track Every Game',
            description: 'Keep a personal list of games you\'re playing, want to play, or have finished. Never lose track again.',
        },
        {
            icon: '⭐',
            title: 'Rate & Review',
            description: 'Share your honest take with a precise 0-10 rating and a detailed written review for every game.',
        },
        {
            icon: '🔍',
            title: 'Discover New Games',
            description: 'Browse thousands of titles pulled live from a massive game database, updated in real time.',
        },
        {
            icon: '👥',
            title: 'Community Insights',
            description: 'See what other players think before you decide what to play next. Real reviews, real people.',
        },
        {
            icon: '🎯',
            title: 'Personalized For You',
            description: 'Pick your favorite genres and get recommendations tailored to what you actually enjoy playing.',
        },
        {
            icon: '📊',
            title: 'Your Gaming Stats',
            description: 'Visualize your gaming habits — genres you love, ratings you give, and how your taste evolves.',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Create your account',
            description: 'Sign up in under a minute with just a username and email. Select your favorite gaming genres so Playscore can immediately tailor fresh recommendations specifically to your taste.',
            image: previewGames[0]?.cover_url || 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
        },
        {
            number: '02',
            title: 'Browse & discover',
            description: `Explore a vast catalog of over ${totalGamesCount ? totalGamesCount.replace('+', '') : '800K'} games across all platforms. Filter by trending titles, search your childhood favorites, watch official trailers, and build your custom game lists effortlessly.`,
            image: previewGames[1]?.cover_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        },
        {
            number: '03',
            title: 'Rate & share',
            description: 'Keep track of games you are currently playing or completed. Rate every game with a precise 0-10 score, write detailed reviews, and discover authentic recommendations from real gamers in the community.',
            image: previewGames[2]?.cover_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        },
    ];

    const openTrailer = (e, title) => {
        e.stopPropagation();
        const query = encodeURIComponent(`${title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#0B0F0D]">
            <Head title="Welcome to Playscore" />

            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-[#0B0F0D]/90 backdrop-blur-sm border-b border-[#1F2923]">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                            <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                        </div>
                        <span className="text-[#F5F7F5] font-semibold text-lg">Playscore</span>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section
                className="relative overflow-hidden border-b border-[#1F2923] flex items-center"
                style={{ minHeight: 'calc(100vh - 64px)' }}
            >
                <HeroBackground images={previewGames.slice(0, 4).map((g) => g.cover_url)} />

                <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-12 w-full py-12 sm:py-0">
                    <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
                        <h1 className="text-[#F5F7F5] text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 tracking-tight">
                            Rate it. Review it.<br />Remember it.
                        </h1>
                        <p className="text-[#8B948F] text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto sm:mx-0">
                            Track every game you play, share honest reviews, and discover what to
                            play next based on what you actually like.
                        </p>
                        {canRegister && (
                            <div className="mb-8 sm:mb-10 flex justify-center sm:justify-start">
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg bg-[#22C55E] text-[#0B0F0D] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-[#4ADE80] transition"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        )}

                        {/* Inline Stats */}
                        <div className="pt-4 sm:pt-6 grid grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
                            <div>
                                <p className="text-[#22C55E] text-xl sm:text-3xl font-bold">{totalGamesCount || '800K+'}</p>
                                <p className="text-[#8B948F] text-[11px] sm:text-sm mt-0.5 sm:mt-1">Games in database</p>
                            </div>
                            <div>
                                <p className="text-[#22C55E] text-xl sm:text-3xl font-bold">0-10</p>
                                <p className="text-[#8B948F] text-[11px] sm:text-sm mt-0.5 sm:mt-1">Precise rating scale</p>
                            </div>
                            <div>
                                <p className="text-[#22C55E] text-xl sm:text-3xl font-bold">Free</p>
                                <p className="text-[#8B948F] text-[11px] sm:text-sm mt-0.5 sm:mt-1">Forever, no catch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works (Interactive Card Slider) */}
            <section className="bg-[#F4F6F4] text-[#0B0F0D]">
                <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-[#0B0F0D] text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">How it works</h2>
                        <p className="text-[#4A5568] text-sm sm:text-base max-w-xl mx-auto">
                            Three simple steps to start tracking your games.
                        </p>
                    </div>

                    {/* Step Content: Left Card Image, Right Description */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center">
                        {/* Cover image card on left (compact height 16:9 aspect ratio) */}
                        <div className="md:col-span-5 lg:col-span-5">
                            <div className="relative aspect-[16/9] max-h-[260px] rounded-2xl overflow-hidden shadow-xl border border-[#E2E8F0] bg-[#0B0F0D]">
                                <img
                                    src={steps[activeStep].image}
                                    alt={steps[activeStep].title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <span className="absolute top-3 left-3 bg-[#16A34A] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow">
                                    STEP {steps[activeStep].number}
                                </span>
                            </div>
                        </div>

                        {/* Title & Description on right */}
                        <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-center pl-0 md:pl-4">
                            <span className="text-[#16A34A] text-4xl sm:text-6xl font-extrabold leading-none mb-2 sm:mb-4">
                                {steps[activeStep].number}
                            </span>
                            <h3 className="text-[#0B0F0D] text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                                {steps[activeStep].title}
                            </h3>
                            <p className="text-[#4A5568] text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
                                {steps[activeStep].description}
                            </p>

                            {/* Arrow Controls & Indicators */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))}
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#CBD5E1] shadow-sm flex items-center justify-center text-[#0B0F0D] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition"
                                        title="Previous step"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={() => setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))}
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#CBD5E1] shadow-sm flex items-center justify-center text-[#0B0F0D] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition"
                                        title="Next step"
                                    >
                                        →
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 ml-3 sm:ml-4">
                                    {steps.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveStep(idx)}
                                            className={`h-2 rounded-full transition-all ${idx === activeStep ? 'w-6 sm:w-8 bg-[#16A34A]' : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features (Light mode) */}
            <section className="bg-[#FFFFFF] border-t border-[#E2E8F0] text-[#0B0F0D]">
                <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-[#0B0F0D] text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                            Everything you need
                        </h2>
                        <p className="text-[#4A5568] text-sm sm:text-base">
                            Built for people who take their gaming seriously.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 hover:bg-[#1E293B] hover:border-[#334155] hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 transform shadow-sm hover:shadow-xl cursor-pointer"
                            >
                                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{feature.icon}</div>
                                <h3 className="text-[#0B0F0D] group-hover:text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 transition">
                                    {feature.title}
                                </h3>
                                <p className="text-[#4A5568] group-hover:text-[#94A3B8] text-xs sm:text-sm leading-relaxed transition">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Game preview (Light mode) */}
            {previewGames.length > 0 && (
                <section className="bg-[#F4F6F4] border-t border-[#E2E8F0] text-[#0B0F0D]">
                    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-[#0B0F0D] text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">
                                Trending Right Now
                            </h2>
                            <p className="text-[#4A5568] text-sm sm:text-base">
                                A taste of what you'll find on Playscore.
                            </p>
                        </div>

                        {/* Responsive horizontal scroll slider on mobile/tablet, grid on desktop */}
                        <div className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory px-4 sm:px-6 lg:px-0 -mx-5 sm:-mx-8 lg:mx-0 scroll-px-4 sm:scroll-px-6">
                            <div className="flex-shrink-0 w-1 sm:w-2 lg:hidden" />
                            {previewGames.map((game) => (
                                <div
                                    key={game.external_id}
                                    className="group flex-shrink-0 w-32 sm:w-40 lg:w-auto bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:bg-[#1E293B] hover:border-[#334155] transition duration-300 snap-start"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img
                                            src={game.cover_url}
                                            alt={game.title}
                                            onError={(e) => {
                                                e.target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                                    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="#131916"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#22C55E" font-family="sans-serif" font-size="24" font-weight="bold">${game.title.replace(/&/g, '&amp;')}</text></svg>`
                                                )}`;
                                            }}
                                            className="w-full h-full object-cover"
                                        />
                                        {game.rawg_rating && (
                                            <div className="absolute top-1.5 right-1.5 bg-[#0B0F0D]/80 backdrop-blur-sm text-[#22C55E] text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md">
                                                ★ {Number(game.rawg_rating).toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 sm:p-3">
                                        <p className="text-[#0B0F0D] group-hover:text-white text-[11px] sm:text-xs font-semibold truncate mb-1.5 sm:mb-2 transition-colors">
                                            {game.title}
                                        </p>
                                        <button
                                            onClick={(e) => openTrailer(e, game.title)}
                                            className="w-full rounded-md bg-white text-[#0B0F0D] text-[10px] sm:text-xs font-semibold py-1 transition border border-[#E2E8F0] hover:bg-[#F8FAFC]"
                                        >
                                            Trailer
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex-shrink-0 w-1 sm:w-2 lg:hidden" />
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-16 bg-[#0B0F0D] text-[#8B948F]">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 sm:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-md bg-[#22C55E] flex items-center justify-center">
                                    <span className="text-[#0B0F0D] font-bold text-xs">P</span>
                                </div>
                                <span className="text-[#F5F7F5] font-semibold">Playscore</span>
                            </div>
                            <p className="text-[#8B948F] text-sm leading-relaxed hover:text-white transition-colors cursor-default">
                                Rate it. Review it. Remember it.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Product</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('register')} className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('login')} className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                                        Log In
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Resources</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://rawg.io/apidocs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
                                    >
                                        Game Data by RAWG API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setLegalModal('privacy')}
                                        className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all text-left"
                                    >
                                        Privacy Policy
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setLegalModal('terms')}
                                        className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all text-left"
                                    >
                                        Terms of Service
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[#1F2923] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[#8B948F] text-sm hover:text-white transition-colors cursor-default">
                            © {new Date().getFullYear()} Playscore. All rights reserved.
                        </p>
                        <a
                            href="https://rawg.io/apidocs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B948F] text-xs hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
                        >
                            Game data powered by RAWG API
                        </a>
                    </div>
                </div>
            </footer>

            {/* Legal Modal Popup */}
            <Modal show={legalModal !== null} onClose={() => setLegalModal(null)}>
                <div className="p-6 sm:p-8 bg-[#131916] text-[#F5F7F5] border border-[#1F2923] rounded-xl max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#1F2923] pb-4 mb-6">
                        <h3 className="text-xl font-bold text-[#F5F7F5]">
                            {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                        </h3>
                        <button
                            onClick={() => setLegalModal(null)}
                            className="text-[#8B948F] hover:text-white text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1F2923] transition"
                        >
                            ✕
                        </button>
                    </div>

                    {legalModal === 'privacy' && (
                        <div className="space-y-4 text-sm text-[#8B948F] leading-relaxed">
                            <p>
                                Welcome to Playscore. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">1. Information We Collect</h4>
                            <p>
                                We collect information you provide directly to us when creating an account, such as your username and email address, as well as your game ratings, reviews, and list preferences.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">2. How We Use Your Information</h4>
                            <p>
                                We use your data to personalize your gaming recommendations, maintain your personal game tracker, and display community ratings and reviews across the platform.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">3. Data Protection</h4>
                            <p>
                                We implement security measures to ensure the safety of your personal information. We do not sell or rent your personal data to third parties.
                            </p>
                        </div>
                    )}

                    {legalModal === 'terms' && (
                        <div className="space-y-4 text-sm text-[#8B948F] leading-relaxed">
                            <p>
                                By accessing or using Playscore, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">1. Account Responsibility</h4>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">2. User Content & Conduct</h4>
                            <p>
                                Reviews and ratings submitted to Playscore must follow community guidelines. Spam, offensive content, or misleading reviews are strictly prohibited.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">3. External Data Attribution</h4>
                            <p>
                                Game metadata and imagery are provided via the RAWG API. Playscore claims no ownership over official game artwork, titles, or trademarks.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t border-[#1F2923] flex justify-end">
                        <button
                            onClick={() => setLegalModal(null)}
                            className="bg-[#22C55E] text-[#0B0F0D] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#4ADE80] transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}