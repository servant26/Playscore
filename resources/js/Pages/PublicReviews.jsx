import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import Modal from '@/Components/Modal';
import { getAvatarUrl } from '@/Utils/avatar';

export default function PublicReviews({ reviews = [], currentFilter = 'all' }) {
    const [authModal, setAuthModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // Persistent filter state across page refresh (URL param & sessionStorage)
    const [filter, setFilter] = useState(() => {
        if (typeof window !== 'undefined') {
            const urlParam = new URLSearchParams(window.location.search).get('filter');
            if (urlParam) return urlParam;

            const savedFilter = sessionStorage.getItem('playscore_reviews_filter');
            if (savedFilter) return savedFilter;
        }
        return currentFilter || 'all';
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('playscore_reviews_filter', newFilter);
            const url = new URL(window.location);
            url.searchParams.set('filter', newFilter);
            window.history.replaceState({}, '', url);
        }
    };

    const handleCardClick = (rev) => {
        setSelectedReview(rev);
        setAuthModal(true);
    };

    const displayedReviews = filter === 'highest'
        ? [...reviews].sort((a, b) => b.rating - a.rating)
        : reviews;

    return (
        <div className="min-h-screen lg:h-screen bg-[#0B0F0D] flex flex-col lg:overflow-hidden">
            <Head title="Community Reviews - Playscore" />

            {/* Custom Smooth Dark Scrollbar Styling */}
            <style>{`
                /* Custom Smooth Dark Scrollbar */
                .custom-smooth-scrollbar {
                    scroll-behavior: smooth;
                }
                .custom-smooth-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-smooth-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-smooth-scrollbar::-webkit-scrollbar-thumb {
                    background: #1F2923;
                    border-radius: 9999px;
                    transition: background-color 0.3s ease;
                }
                .custom-smooth-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #22C55E;
                }
            `}</style>

            {/* Dark Navbar */}
            <PublicNavbar currentRoute="reviews.index" variant="dark" />

            {/* Cover Layout (Exact 100vh - 64px height on PC desktop, responsive scroll on mobile/tablet) */}
            <main
                className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 flex flex-col lg:flex-row gap-6 lg:gap-12 lg:h-[calc(100vh-64px)] lg:overflow-hidden"
            >
                {/* KIRI: Deskripsi & Filter (Vertically Centered on PC) */}
                <div className="lg:w-5/12 flex flex-col justify-center bg-[#0E1411] border border-[#1F2923] rounded-3xl p-6 sm:p-8 lg:p-10 text-[#F5F7F5] shrink-0 lg:h-full overflow-hidden">
                    <div className="space-y-6 sm:space-y-8">
                        <div>
                            <span className="text-[#22C55E] text-xs font-semibold uppercase tracking-wider bg-[#22C55E]/10 px-3.5 py-1.5 rounded-full border border-[#22C55E]/20 inline-block mb-4 sm:mb-6">
                                Community Critiques
                            </span>
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 sm:mb-6 leading-tight">
                                Community Reviews
                            </h1>
                            <p className="text-[#8B948F] text-xs sm:text-base leading-relaxed">
                                Honest written reviews and 0–10 score ratings shared by real gamers in the community.
                            </p>
                        </div>

                        {/* Filter Switcher Buttons */}
                        <div className="space-y-3 pt-4 sm:pt-6 border-t border-[#1F2923]">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B948F] block mb-2">
                                Filter Reviews:
                            </span>
                            <div className="flex flex-row sm:flex-col gap-3">
                                <button
                                    onClick={() => handleFilterChange('all')}
                                    className={`flex-1 sm:w-full text-center sm:text-left px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                                        filter === 'all'
                                            ? 'bg-[#22C55E] text-[#0B0F0D]'
                                            : 'bg-[#161F1A] text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                                    }`}
                                >
                                    <span>Latest Reviews</span>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('highest')}
                                    className={`flex-1 sm:w-full text-center sm:text-left px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                                        filter === 'highest'
                                            ? 'bg-[#22C55E] text-[#0B0F0D]'
                                            : 'bg-[#161F1A] text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                                    }`}
                                >
                                    <span>Top Rated First</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KANAN: Content area */}
                <div className="lg:w-7/12 h-[550px] lg:h-full overflow-hidden relative rounded-3xl lg:rounded-none">
                    {/* Smooth Dark Scrollbar List for Reviews */}
                    <div className="h-full overflow-y-auto pr-2 sm:pr-3 space-y-4 custom-smooth-scrollbar">
                        {displayedReviews.map((rev) => (
                            <div
                                key={rev.id}
                                className="bg-[#0E1411] border border-[#1F2923] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#22C55E]/60 hover:bg-[#161F1A] transition-all group cursor-pointer"
                                onClick={() => handleCardClick(rev)}
                            >
                                <div>
                                    {/* Header: Game Info & Score */}
                                    <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                        <div className="w-14 sm:w-16 h-18 sm:h-20 rounded-xl overflow-hidden bg-[#161F1A] shrink-0 border border-[#1F2923]">
                                            <img
                                                src={rev.game_cover}
                                                alt={rev.game_title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base sm:text-lg text-[#F5F7F5] truncate group-hover:text-[#22C55E] transition-colors mb-1">
                                                {rev.game_title}
                                            </h3>
                                            <div className="inline-flex items-center gap-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs font-bold text-[#22C55E]">
                                                <span>Score: {rev.rating} / 10</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Body Truncated */}
                                    <p className="text-xs sm:text-sm text-[#8B948F] leading-relaxed italic mb-3 line-clamp-3">
                                        "{rev.body}"
                                    </p>
                                    <span className="text-xs text-[#22C55E] font-semibold hover:underline inline-block mb-3">
                                        Read full review &rarr;
                                    </span>
                                </div>

                                {/* Footer: Reviewer Info */}
                                <div className="pt-3 border-t border-[#1F2923] flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={getAvatarUrl(rev.user_avatar) || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.user_name)}`}
                                            alt={rev.user_name}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.user_name)}`;
                                            }}
                                            className="w-7 h-7 rounded-full object-cover bg-[#161F1A] border border-[#1F2923]"
                                        />
                                        <span className="text-xs font-semibold text-[#F5F7F5]">
                                            {rev.user_name}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-[#8B948F]">
                                        {rev.created_at}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Auth Required Modal */}
            <Modal show={authModal} onClose={() => setAuthModal(false)} maxWidth="md">
                <div className="bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] p-6 sm:p-8 rounded-2xl relative">
                    <button
                        onClick={() => setAuthModal(false)}
                        className="absolute top-4 right-4 text-[#8B948F] hover:text-[#F5F7F5] transition text-sm"
                    >
                        ✕
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xl flex items-center justify-center mx-auto mb-3">
                            P
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            Join Playscore to Read Full Review
                        </h2>
                        <p className="text-xs text-[#8B948F]">
                            Log in or create a free account to unlock full community critiques, rate games, and share your stats.
                        </p>
                    </div>

                    {selectedReview && (
                        <div className="bg-[#161F1A] border border-[#1F2923] rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <img
                                    src={selectedReview.game_cover}
                                    alt={selectedReview.game_title}
                                    className="w-10 h-12 rounded-md object-cover bg-[#0E1411]"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-white truncate max-w-[220px]">
                                        {selectedReview.game_title}
                                    </h4>
                                    <span className="text-[#22C55E] text-xs font-bold">
                                        Score: {selectedReview.rating} / 10
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-[#8B948F] italic line-clamp-2">
                                "{selectedReview.body}"
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link
                            href={route('login')}
                            className="block w-full text-center bg-[#22C55E] text-[#0B0F0D] font-bold text-sm py-3 rounded-xl hover:bg-[#4ADE80] transition shadow-md shadow-[#22C55E]/20"
                        >
                            Log In to Account
                        </Link>
                        <Link
                            href={route('register')}
                            className="block w-full text-center bg-[#161F1A] border border-[#1F2923] text-[#F5F7F5] font-semibold text-sm py-3 rounded-xl hover:bg-[#1F2923] transition"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
