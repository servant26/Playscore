import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function StoryViewerModal({ show, stories = [], initialIndex = 0, onClose, onStoryViewed }) {
    const authUser = usePage().props.auth?.user;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setCurrentIndex(initialIndex);
        setProgress(0);
    }, [initialIndex, show]);

    const currentStory = stories[currentIndex] || stories[0];

    useEffect(() => {
        if (show && currentStory?.id && onStoryViewed) {
            onStoryViewed(currentStory.id);
        }
    }, [show, currentStory?.id]);

    useEffect(() => {
        if (!show || stories.length === 0) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex((i) => i + 1);
                        return 0;
                    } else {
                        onClose();
                        return 100;
                    }
                }
                return prev + 2; // 5 seconds duration (50 steps * 100ms)
            });
        }, 100);

        return () => clearInterval(interval);
    }, [show, currentIndex, stories.length]);

    if (!show || stories.length === 0) return null;
    if (!currentStory || !currentStory.review) return null;

    const goToPrev = (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    };

    const goToNext = (e) => {
        e.stopPropagation();
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const goToGame = (e, slug) => {
        e.stopPropagation();
        onClose();
        router.get(route('games.show', slug));
    };

    const isOwnStory = authUser && authUser.id === currentStory.user_id;

    const goToUser = (e, userId) => {
        e.stopPropagation();
        if (authUser && authUser.id === userId) {
            return; // Own story -> do nothing
        }
        onClose();
        router.get(route('users.show', userId));
    };

    return (
        <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            {/* Story Card Container */}
            <div
                className="relative w-full max-w-sm h-auto rounded-2xl overflow-hidden shadow-2xl border border-[#1F2923] bg-[#0B0F0D] flex flex-col gap-4 p-5 sm:p-6 select-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Image with Blur Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={currentStory.review.game_cover}
                        alt={currentStory.review.game_title}
                        className="w-full h-full object-cover filter blur-xl scale-110 opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
                </div>

                {/* Top Section: Progress Bar + User Header */}
                <div className="relative z-10 space-y-4">
                    {/* Progress Bar Segment */}
                    <div className="flex gap-1.5 w-full">
                        {stories.map((s, idx) => (
                            <div
                                key={s.id}
                                className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
                            >
                                <div
                                    className="h-full bg-[#22C55E] transition-all ease-linear duration-100"
                                    style={{
                                        width:
                                            idx < currentIndex
                                                ? '100%'
                                                : idx === currentIndex
                                                ? `${progress}%`
                                                : '0%',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* User Header */}
                    <div className="flex items-center justify-between">
                        <div
                            onClick={(e) => goToUser(e, currentStory.user_id)}
                            className={`flex items-center gap-3 z-30 ${
                                isOwnStory ? 'cursor-default' : 'cursor-pointer group'
                            }`}
                            title={isOwnStory ? undefined : `View ${currentStory.user_name}'s profile`}
                        >
                            <div className={`w-10 h-10 rounded-full bg-[#131916] border border-[#22C55E] transition flex items-center justify-center text-[#22C55E] font-semibold text-sm overflow-hidden shrink-0 shadow-lg ${
                                isOwnStory ? '' : 'group-hover:border-white'
                            }`}>
                                {currentStory.user_avatar ? (
                                    <img
                                        src={`/storage/${currentStory.user_avatar}`}
                                        alt={currentStory.user_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    currentStory.user_name.slice(0, 2).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h4 className={`text-[#F5F7F5] font-semibold text-sm drop-shadow-md transition ${
                                    isOwnStory ? '' : 'group-hover:text-[#22C55E]'
                                }`}>
                                    {currentStory.user_name}
                                </h4>
                                <p className="text-[#22C55E] text-[11px] font-medium drop-shadow">
                                    Story · {currentStory.created_at}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center text-sm transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Middle Content: Game Wrapped Card */}
                <div className="relative z-10 flex flex-col items-center w-full shrink-0 mt-2 sm:mt-2.5">
                    {/* Wide Cover Art - Strict Fixed Height */}
                    <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden shadow-2xl border border-[#2E3A32] mb-3 shrink-0">
                        <img
                            src={currentStory.review.game_cover}
                            alt={currentStory.review.game_title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-[#0B0F0D]/90 backdrop-blur-md text-[#22C55E] text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md border border-[#22C55E]/40 shadow-lg">
                            {Number(currentStory.review.rating).toFixed(1)} ★
                        </div>
                    </div>

                    {/* Fixed Height Header & Description Box */}
                    <div className="w-full h-[64px] shrink-0 mb-2 flex flex-col justify-center">
                        <h3 className="text-[#F5F7F5] text-base font-bold drop-shadow line-clamp-1">
                            {currentStory.review.game_title}
                        </h3>
                        <p className="text-[#8B948F] text-[11px] sm:text-xs leading-tight line-clamp-2 mt-0.5">
                            I've completed this game! You can check out my full review below or press the button to view the game page.
                        </p>
                    </div>

                    {/* Fixed Height Review Quote Box */}
                    <div className="h-[76px] w-full shrink-0 bg-[#131916]/80 backdrop-blur-md border border-[#1F2923] rounded-xl px-3.5 py-2.5 flex items-center justify-start shadow-lg overflow-hidden">
                        <p className="text-[#8B948F] text-xs leading-relaxed italic line-clamp-3">
                            "{currentStory.review.body || 'No written review text provided.'}"
                        </p>
                    </div>
                </div>

                {/* Bottom Footer: Action */}
                <div className="relative z-10 pt-2">
                    <button
                        onClick={(e) => goToGame(e, currentStory.review.game_slug)}
                        style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                        className="w-full rounded-xl font-bold py-2.5 text-xs sm:text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>View Game</span>
                        <span>→</span>
                    </button>
                </div>

                {/* Tap Left / Right Controls */}
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 z-20 focus:outline-none disabled:cursor-default"
                />
                <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 z-20 focus:outline-none"
                />
            </div>
        </div>
    );
}
