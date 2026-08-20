import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import { getRankInfo } from '@/Utils/rankSystem';

export default function StoryViewerModal({ show, stories = [], initialIndex = 0, onClose, onStoryViewed }) {
    const authUser = usePage().props.auth?.user;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Congratulation Modal State
    const [showCongratModal, setShowCongratModal] = useState(false);
    const [congratMessage, setCongratMessage] = useState('');
    const [sendingCongrat, setSendingCongrat] = useState(false);
    const [congratSent, setCongratSent] = useState(false);
    const [hasCongratulated, setHasCongratulated] = useState(false);

    const currentStory = stories[currentIndex] || stories[0];

    useEffect(() => {
        setCurrentIndex(initialIndex);
        setProgress(0);
        setShowConfirmDelete(false);
        setShowCongratModal(false);
        setCongratSent(false);
    }, [initialIndex, show]);

    useEffect(() => {
        if (currentStory?.id && authUser?.id) {
            const key = `congrat_story_${currentStory.id}_${authUser.id}`;
            setHasCongratulated(localStorage.getItem(key) === 'true');
        }
    }, [currentStory?.id, authUser?.id]);

    useEffect(() => {
        if (show && currentStory?.id && onStoryViewed) {
            onStoryViewed(currentStory.id);
        }
    }, [show, currentStory?.id]);

    useEffect(() => {
        if (!show || stories.length === 0 || showConfirmDelete || showCongratModal) return;

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
                return prev + 2; // 5 seconds duration
            });
        }, 100);

        return () => clearInterval(interval);
    }, [show, currentIndex, stories.length, showConfirmDelete, showCongratModal]);

    if (!show || stories.length === 0) return null;
    if (!currentStory) return null;
    if (currentStory.type !== 'rank_up' && !currentStory.review) return null;

    const isRankStory = currentStory.type === 'rank_up';
    const isOwnStory = Boolean(authUser && Number(authUser.id) === Number(currentStory?.user_id));

    const goToPrev = (e) => {
        e.stopPropagation();
        if (showConfirmDelete || showCongratModal) return;
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    };

    const goToNext = (e) => {
        e.stopPropagation();
        if (showConfirmDelete || showCongratModal) return;
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

    const goToUser = (e, userId) => {
        e.stopPropagation();
        onClose();
        if (authUser && Number(authUser.id) === Number(userId)) {
            router.get(route('profile.edit'));
        } else {
            router.get(route('users.show', userId));
        }
    };

    const handleDeleteStory = (e) => {
        e.stopPropagation();
        if (!currentStory?.id || deleting) return;
        setDeleting(true);

        router.delete(route('stories.destroy', currentStory.id), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                setDeleting(false);
                setShowConfirmDelete(false);
                onClose();
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    const handleSendCongratulations = (e) => {
        e.preventDefault();
        if (sendingCongrat || congratSent || hasCongratulated) return;
        setSendingCongrat(true);

        const rankName = currentStory.rank_name || 'Gamer Rank';
        const finalMessage = congratMessage.trim() || `Congratulations on reaching ${rankName}! 🎉`;

        fetch(route('users.congratulate-rank', currentStory.user_id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                rank_name: rankName,
                message: finalMessage,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                setSendingCongrat(false);
                setCongratSent(true);

                // Persist that user has already congratulated this story
                if (currentStory?.id && authUser?.id) {
                    const key = `congrat_story_${currentStory.id}_${authUser.id}`;
                    localStorage.setItem(key, 'true');
                    setHasCongratulated(true);
                }

                setTimeout(() => {
                    setShowCongratModal(false);
                    setCongratSent(false);
                }, 1200);
            })
            .catch(() => setSendingCongrat(false));
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[99999] p-4 select-none"
            onClick={onClose}
        >
            {/* Main Story Card Container */}
            <div
                className="relative w-full max-w-sm h-[540px] sm:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-[#1F2923] bg-[#0B0F0D] flex flex-col justify-between p-5 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Blur Overlay */}
                <div className="absolute inset-0 z-0">
                    {isRankStory ? (
                        <div className="w-full h-full bg-gradient-to-b from-[#131916] via-[#0B0F0D] to-[#050706] opacity-95" />
                    ) : (
                        <>
                            <img
                                src={currentStory.review.game_cover}
                                alt={currentStory.review.game_title}
                                className="w-full h-full object-cover filter blur-xl scale-110 opacity-30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
                        </>
                    )}
                </div>

                {/* Top Section: Progress Bar + User Header */}
                <div className="relative z-10 space-y-3.5">
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
                            className="flex items-center gap-3 z-30 cursor-pointer group"
                            title={`View ${currentStory.user_name}'s profile`}
                        >
                            <div className="w-9 h-9 rounded-full bg-[#131916] border border-[#22C55E] transition flex items-center justify-center text-[#22C55E] font-medium text-xs overflow-hidden shrink-0 shadow-lg group-hover:border-white">
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
                                <h4 className="text-[#F5F7F5] font-medium text-xs sm:text-sm drop-shadow-md transition group-hover:text-[#22C55E]">
                                    {currentStory.user_name}
                                </h4>
                                <p className="text-[#8B948F] text-[11px] font-normal drop-shadow">
                                    {isRankStory ? 'Rank Achievement' : 'Story'} · {currentStory.created_at}
                                </p>
                            </div>
                        </div>

                        {/* Control Icon: Vertical Three Dots (⋮) for own stories opens Delete Modal directly; Close (✕) for others */}
                        <div className="relative z-40">
                            {isOwnStory ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowConfirmDelete(true);
                                    }}
                                    title="Delete Story"
                                    className="w-8 h-8 rounded-full bg-black/40 text-[#F5F7F5] hover:bg-black/70 flex items-center justify-center text-lg transition font-bold"
                                >
                                    ⋮
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-black/40 text-[#F5F7F5] hover:bg-black/70 flex items-center justify-center text-sm transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle Content: Fixed Height Story Body Container (370px) */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full h-[370px] shrink-0 my-auto">
                    {isRankStory ? (
                        (() => {
                            const rankInfo = getRankInfo(currentStory.rank_count || 0);
                            const cRank = rankInfo.currentRank;

                            return (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-b from-[#161F1A] to-[#0D1310] border border-[#2E3A32] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    {/* High Contrast Badge Container */}
                                    <div
                                        className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl bg-gradient-to-br ${cRank.badgeGradient} border-2 border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.15)] mb-3 transform hover:scale-105 transition duration-300`}
                                    >
                                        {cRank.icon}
                                    </div>

                                    <span className="text-[10px] font-extrabold text-[#8B948F] uppercase tracking-widest mb-1">
                                        Rank Milestone Reached
                                    </span>

                                    {/* High Contrast Rank Title */}
                                    <h3 className="text-xl sm:text-2xl font-black text-[#F5F7F5] tracking-tight drop-shadow-md">
                                        {currentStory.rank_name || cRank.name}
                                    </h3>

                                    <div className="mt-2 inline-flex items-center px-3.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-bold shadow-sm">
                                        {currentStory.rank_count || cRank.min} Verified Game Reviews
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-[#8B948F] mt-3 leading-relaxed max-w-xs">
                                        {currentStory.user_name} has officially promoted to <span className={cRank.color}>{currentStory.rank_name || cRank.name}</span> on Playscore!
                                    </p>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="w-full h-full flex flex-col justify-between items-center py-1">
                            {/* Wide Cover Art */}
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-2xl border border-[#2E3A32] shrink-0">
                                <img
                                    src={currentStory.review.game_cover}
                                    alt={currentStory.review.game_title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2.5 right-2.5 bg-[#0B0F0D]/90 backdrop-blur-md text-[#22C55E] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#22C55E]/40 shadow-lg">
                                    {Number(currentStory.review.rating).toFixed(1)} ★
                                </div>
                            </div>

                            {/* Header & Description Box */}
                            <div className="w-full shrink-0 flex flex-col justify-center my-1.5">
                                <h3 className="text-[#F5F7F5] text-sm sm:text-base font-bold drop-shadow line-clamp-1">
                                    {currentStory.review.game_title}
                                </h3>
                                <p className="text-[#8B948F] text-[11px] leading-tight line-clamp-2 mt-0.5">
                                    I've completed this game! Check out my full review below or press the button to view the game page.
                                </p>
                            </div>

                            {/* Review Quote Box */}
                            <div className="h-[72px] w-full shrink-0 bg-[#131916]/80 backdrop-blur-md border border-[#1F2923] rounded-xl px-3.5 py-2.5 flex items-center justify-start shadow-lg overflow-hidden">
                                <p className="text-[#8B948F] text-xs leading-relaxed italic line-clamp-3">
                                    "{currentStory.review.body || 'No written review text provided.'}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Footer: Action Button */}
                <div className="relative z-10 pt-1">
                    {isRankStory ? (
                        isOwnStory ? (
                            <button
                                type="button"
                                onClick={(e) => goToUser(e, currentStory.user_id)}
                                style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                className="w-full rounded-xl font-bold py-2.5 text-xs sm:text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>View My Rank</span>
                                <span>→</span>
                            </button>
                        ) : hasCongratulated ? (
                            <div className="w-full rounded-xl bg-[#131916] border border-[#1F2923] text-[#8B948F] text-xs sm:text-sm font-medium py-2.5 text-center flex items-center justify-center gap-2">
                                <span>You've sent congratulations to {currentStory.user_name}</span>
                                <span>🎉</span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rankName = currentStory.rank_name || 'Gamer Rank';
                                    setCongratMessage(`Congratulations on reaching ${rankName}! 🎉`);
                                    setShowCongratModal(true);
                                }}
                                style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                className="w-full rounded-xl font-bold py-2.5 text-xs sm:text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>Send Congratulations</span>
                                <span>🎉</span>
                            </button>
                        )
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => goToGame(e, currentStory.review.game_slug)}
                            style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                            className="w-full rounded-xl font-bold py-2.5 text-xs sm:text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>View Game</span>
                            <span>→</span>
                        </button>
                    )}
                </div>

                {/* Tap Left / Right Controls */}
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0 || showConfirmDelete || showCongratModal}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 z-20 focus:outline-none disabled:cursor-default"
                />
                <button
                    onClick={goToNext}
                    disabled={showConfirmDelete || showCongratModal}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 z-20 focus:outline-none"
                />
            </div>

            {/* Send Congratulations Modal - Enlarged & Spacious */}
            {showCongratModal && (
                <div
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowCongratModal(false);
                    }}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-3xl p-6 sm:p-7 max-w-md w-full text-center shadow-2xl text-[#F5F7F5]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center text-2xl mx-auto mb-4">
                            🎉
                        </div>
                        <h4 className="text-xl font-bold text-[#F5F7F5]">
                            Congratulate {currentStory.user_name}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#8B948F] mt-1.5 mb-4">
                            Send a congratulatory message on reaching <span className="text-[#F5F7F5] font-semibold">{currentStory.rank_name || 'their rank milestone'}</span>:
                        </p>

                        <form onSubmit={handleSendCongratulations} className="space-y-4">
                            <textarea
                                value={congratMessage}
                                onChange={(e) => setCongratMessage(e.target.value)}
                                rows={4}
                                className="w-full rounded-2xl bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] p-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none leading-relaxed"
                                placeholder="Write a nice congratulations message..."
                            />

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowCongratModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-[#1F2923] text-[#8B948F] text-xs sm:text-sm font-semibold hover:text-[#F5F7F5] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingCongrat || congratSent}
                                    className="flex-1 py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] text-xs sm:text-sm font-bold transition disabled:opacity-75 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {sendingCongrat ? 'Sending...' : congratSent ? 'Sent! 🎉' : 'Send 🎉'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal Overlay */}
            {showConfirmDelete && (
                <div
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirmDelete(false);
                    }}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl text-[#F5F7F5]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center text-xl mx-auto mb-3">
                            🗑️
                        </div>
                        <h4 className="text-base font-bold text-[#F5F7F5]">Delete Story?</h4>
                        <p className="text-xs text-[#8B948F] mt-1.5 mb-5 leading-relaxed">
                            Are you sure you want to delete this story? It will be permanently removed for all followers.
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirmDelete(false);
                                }}
                                className="flex-1 py-2.5 rounded-xl border border-[#1F2923] text-[#8B948F] text-xs font-semibold hover:text-[#F5F7F5] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteStory}
                                disabled={deleting}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
