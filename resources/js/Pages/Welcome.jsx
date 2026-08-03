import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, previewGames }) {
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
            description: 'Sign up in under a minute and tell us what genres you love.',
        },
        {
            number: '02',
            title: 'Browse & discover',
            description: 'Explore trending titles, search anything, and build your game list.',
        },
        {
            number: '03',
            title: 'Rate & share',
            description: 'Review the games you\'ve played and see what the community thinks.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F0D]">
            <Head title="Welcome to Playscore" />

            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-[#0B0F0D]/90 backdrop-blur-sm border-b border-[#1F2923]">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                            <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                        </div>
                        <span className="text-[#F5F7F5] font-semibold text-lg">Playscore</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="text-[#8B948F] hover:text-[#F5F7F5] text-sm font-medium transition"
                            >
                                Log in
                            </Link>
                        )}
                        {canRegister && (
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-[#22C55E] text-[#0B0F0D] px-4 py-2 text-sm font-medium hover:bg-[#4ADE80] transition"
                            >
                                Sign up
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: 'radial-gradient(ellipse at top, #22C55E 0%, transparent 60%)',
                    }}
                />
                <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#131916] border border-[#1F2923] rounded-full px-4 py-1.5 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        <span className="text-[#8B948F] text-xs font-medium">
                            Live game data, updated daily
                        </span>
                    </div>

                    <h1 className="text-[#F5F7F5] text-5xl sm:text-6xl font-bold leading-tight mb-6 tracking-tight">
                        Rate it. Review it.<br />Remember it.
                    </h1>
                    <p className="text-[#8B948F] text-lg leading-relaxed max-w-xl mx-auto mb-10">
                        Track every game you play, share honest reviews, and discover what to
                        play next based on what you actually like.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="rounded-lg bg-[#22C55E] text-[#0B0F0D] px-8 py-3 text-sm font-semibold hover:bg-[#4ADE80] transition"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href={route('login')}
                            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-8 py-3 text-sm font-semibold hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="border-y border-[#1F2923] bg-[#0F1512]">
                <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-[#22C55E] text-3xl font-bold">800K+</p>
                        <p className="text-[#8B948F] text-sm mt-1">Games in database</p>
                    </div>
                    <div>
                        <p className="text-[#22C55E] text-3xl font-bold">0-10</p>
                        <p className="text-[#8B948F] text-sm mt-1">Precise rating scale</p>
                    </div>
                    <div>
                        <p className="text-[#22C55E] text-3xl font-bold">Free</p>
                        <p className="text-[#8B948F] text-sm mt-1">Forever, no catch</p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-5xl mx-auto px-6 py-24">
                <div className="text-center mb-14">
                    <h2 className="text-[#F5F7F5] text-3xl font-bold mb-3">How it works</h2>
                    <p className="text-[#8B948F] text-base">
                        Three simple steps to start tracking your games.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={step.number} className="relative">
                            <span className="text-[#1F2923] text-6xl font-bold leading-none">
                                {step.number}
                            </span>
                            <h3 className="text-[#F5F7F5] text-lg font-semibold mt-2 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-[#8B948F] text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="bg-[#0F1512] border-y border-[#1F2923]">
                <div className="max-w-6xl mx-auto px-6 py-24">
                    <div className="text-center mb-14">
                        <h2 className="text-[#F5F7F5] text-3xl font-bold mb-3">
                            Everything you need
                        </h2>
                        <p className="text-[#8B948F] text-base">
                            Built for people who take their gaming seriously.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 hover:border-[#2E3A32] transition"
                            >
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h3 className="text-[#F5F7F5] text-base font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[#8B948F] text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Game preview */}
            {previewGames.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-24">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-[#F5F7F5] text-3xl font-bold mb-2">
                                Trending Right Now
                            </h2>
                            <p className="text-[#8B948F] text-base">
                                A taste of what you'll find on Playscore.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {previewGames.map((game) => (
                            <div
                                key={game.external_id}
                                className="bg-[#131916] border border-[#1F2923] rounded-xl overflow-hidden hover:border-[#2E3A32] transition"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={game.cover_url}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {game.rawg_rating && (
                                        <div className="absolute top-2 right-2 bg-[#0B0F0D]/80 backdrop-blur-sm text-[#22C55E] text-xs font-semibold px-2 py-1 rounded-md">
                                            ★ {Number(game.rawg_rating).toFixed(1)}
                                        </div>
                                    )}
                                </div>
                                <div className="p-2.5">
                                    <p className="text-[#F5F7F5] text-xs font-medium truncate">
                                        {game.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="relative overflow-hidden border-y border-[#1F2923]">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse at center, #22C55E 0%, transparent 70%)',
                    }}
                />
                <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
                    <h2 className="text-[#F5F7F5] text-3xl sm:text-4xl font-bold mb-4">
                        Ready to start tracking?
                    </h2>
                    <p className="text-[#8B948F] text-base mb-8">
                        Join Playscore today — it's free and takes less than a minute.
                    </p>
                    <Link
                        href={route('register')}
                        className="inline-block rounded-lg bg-[#22C55E] text-[#0B0F0D] px-8 py-3 text-sm font-semibold hover:bg-[#4ADE80] transition"
                    >
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 sm:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-md bg-[#22C55E] flex items-center justify-center">
                                    <span className="text-[#0B0F0D] font-bold text-xs">P</span>
                                </div>
                                <span className="text-[#F5F7F5] font-semibold">Playscore</span>
                            </div>
                            <p className="text-[#5A625D] text-sm leading-relaxed">
                                Rate it. Review it. Remember it.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Product</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('register')} className="text-[#8B948F] text-sm hover:text-[#F5F7F5] transition">
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('login')} className="text-[#8B948F] text-sm hover:text-[#F5F7F5] transition">
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
                                        href="https://rawg.io"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#8B948F] text-sm hover:text-[#F5F7F5] transition"
                                    >
                                        Game Data by RAWG
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <span className="text-[#8B948F] text-sm">Privacy Policy</span>
                                </li>
                                <li>
                                    <span className="text-[#8B948F] text-sm">Terms of Service</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[#1F2923] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[#5A625D] text-sm">
                            © {new Date().getFullYear()} Playscore. All rights reserved.
                        </p>
                        <p className="text-[#5A625D] text-xs">
                            Game data powered by RAWG
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}