import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import { getRankInfo } from '@/Utils/rankSystem';

export default function StoryViewerModal({ show, stories = [], initialIndex = 0, onClose, onStoryViewed }) {
    const pageProps = usePage().props;
    const authUser = pageProps.auth?.user;
    const userHighlights = pageProps.highlights || [];

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showHighlightModal, setShowHighlightModal] = useState(false);
    const [newHighlightTitle, setNewHighlightTitle] = useState('');
    const [newHighlightCover, setNewHighlightCover] = useState(null);
    const [newHighlightCoverPreview, setNewHighlightCoverPreview] = useState(null);
    const [highlightProcessing, setHighlightProcessing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const highlightFileInputRef = useRef(null);

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
        setShowMenu(false);
        setShowConfirmDelete(false);
        setShowHighlightModal(false);
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
        if (!show || stories.length === 0 || showConfirmDelete || showCongratModal || showMenu || showHighlightModal) return;

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
    }, [show, currentIndex, stories.length, showConfirmDelete, showCongratModal, showMenu, showHighlightModal]);

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

    const handleAddToHighlight = (highlightId) => {
        if (!currentStory) return;
        setHighlightProcessing(true);
        router.post(
            route('highlights.add-story', highlightId),
            { story_id: currentStory.id },
            {
                onSuccess: () => {
                    setHighlightProcessing(false);
                    setShowHighlightModal(false);
                },
                onError: () => setHighlightProcessing(false),
            }
        );
    };

    const handleCreateAndAddHighlight = (e) => {
        e.preventDefault();
        if (!newHighlightTitle.trim() || !currentStory) return;

        setHighlightProcessing(true);
        router.post(
            route('highlights.store'),
            {
                title: newHighlightTitle.trim(),
                cover_image: newHighlightCover,
                story_id: currentStory.id,
            },
            {
                onSuccess: () => {
                    setNewHighlightTitle('');
                    setNewHighlightCover(null);
                    setNewHighlightCoverPreview(null);
                    setHighlightProcessing(false);
                    setShowHighlightModal(false);
                },
                onError: () => setHighlightProcessing(false),
            }
        );
    };

    const handleDeleteStory = () => {
        if (!currentStory?.id) return;
        setDeleting(true);
        router.delete(route('stories.destroy', currentStory.id), {
            onSuccess: () => {
                setDeleting(false);
                setShowConfirmDelete(false);
                onClose();
            },
            onError: () => setDeleting(false),
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
                className="relative w-full max-w-sm h-[540px] sm:h-[550px] rounded-3xl shadow-2xl border border-[#1F2923] bg-[#0B0F0D] flex flex-col justify-between p-5 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Blur Overlay */}
                <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
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
                <div className="relative z-50 space-y-3.5">
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
                    <div className="flex items-center justify-between relative">
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

                        {/* Control Icon: Vertical Three Dots (⋮) for own stories / options menu */}
                        <div className="relative z-50">
                            {isOwnStory ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu((prev) => !prev);
                                        }}
                                        title="Story Options"
                                        className="w-8 h-8 rounded-full bg-black/40 text-[#F5F7F5] hover:bg-black/70 flex items-center justify-center text-lg transition font-bold"
                                    >
                                        ⋮
                                    </button>

                                    {/* Options Dropdown Menu */}
                                    {showMenu && (
                                        <div
                                            className="absolute right-0 top-10 w-48 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl overflow-hidden z-[100] text-left"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowHighlightModal(true);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-xs text-[#F5F7F5] hover:bg-[#1F2923] transition flex items-center gap-2 font-medium"
                                            >
                                                <svg className="w-3.5 h-3.5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                                <span>Add to Highlights</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowConfirmDelete(true);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-[#1F2923] transition flex items-center gap-2 font-medium border-t border-[#1F2923]"
                                            >
                                                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Delete Story</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-black/40 text-[#F5F7F5] hover:bg-black/70 flex items-center justify-center text-sm transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
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
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rankName = currentStory.rank_name || 'Gamer Rank';
                                    setCongratMessage(`Congratulations on reaching ${rankName}!`);
                                    setShowCongratModal(true);
                                }}
                                style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                className="w-full rounded-xl font-bold py-2.5 text-xs sm:text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>Send Congratulations</span>
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

            {/* Send Congratulations Modal */}
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
                                    {sendingCongrat ? 'Sending...' : congratSent ? 'Sent!' : 'Send'}
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
                        <h4 className="text-base font-bold text-[#F5F7F5]">Delete Story?</h4>
                        <p className="text-xs text-[#8B948F] mt-2 mb-6 leading-relaxed">
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

            {/* Add to Highlight Modal Overlay */}
            {showHighlightModal && (
                <div
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowHighlightModal(false);
                    }}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-3xl p-7 sm:p-8 max-w-md sm:max-w-lg w-full shadow-2xl text-[#F5F7F5] space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#1F2923] pb-3">
                            <h4 className="text-base font-bold text-[#F5F7F5]">Add to Highlights</h4>
                            <button
                                onClick={() => setShowHighlightModal(false)}
                                className="text-[#8B948F] hover:text-[#F5F7F5] transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Existing Highlights List */}
                        {(() => {
                            const availableHighlights = userHighlights.filter((hl) => {
                                if (!currentStory?.id) return true;
                                const hasInStories = hl.stories && hl.stories.some((s) => Number(s.id) === Number(currentStory.id));
                                const hasInStoryIds = hl.story_ids && hl.story_ids.map(Number).includes(Number(currentStory.id));
                                return !hasInStories && !hasInStoryIds;
                            });

                            if (availableHighlights.length === 0) return null;

                            return (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-[#8B948F]">
                                            Select Existing Highlight:
                                        </label>
                                        <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                                            {availableHighlights.map((hl) => (
                                                <div
                                                    key={hl.id}
                                                    className="flex items-center justify-between bg-[#0B0F0D] border border-[#1F2923] rounded-xl p-3"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-9 h-9 rounded-full bg-[#1F2923] overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-[#22C55E]">
                                                            {hl.cover_url ? (
                                                                <img src={hl.cover_url} alt={hl.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                hl.title.slice(0, 2).toUpperCase()
                                                            )}
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-semibold text-[#F5F7F5] truncate">
                                                            {hl.title}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddToHighlight(hl.id)}
                                                        disabled={highlightProcessing}
                                                        className="px-3.5 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] rounded-xl text-xs font-bold transition disabled:opacity-50"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* OR Divider */}
                                    <div className="relative flex items-center justify-center my-3">
                                        <div className="border-t border-[#1F2923] w-full" />
                                        <span className="bg-[#131916] px-3 text-[10px] font-extrabold text-[#8B948F] uppercase tracking-widest absolute">
                                            OR
                                        </span>
                                    </div>
                                </>
                            );
                        })()}

                        {/* Create New Highlight */}
                        <form onSubmit={handleCreateAndAddHighlight} className="space-y-4 pt-1">
                            <label className="block text-xs font-semibold text-[#8B948F]">
                                Create New Highlight:
                            </label>

                            <div className="flex items-center gap-3">
                                <div
                                    onClick={() => highlightFileInputRef.current?.click()}
                                    className="w-12 h-12 rounded-full border border-dashed border-[#1F2923] hover:border-[#22C55E] bg-[#0B0F0D] flex items-center justify-center overflow-hidden cursor-pointer shrink-0 transition"
                                    title="Upload cover image (Optional)"
                                >
                                    {newHighlightCoverPreview ? (
                                        <img src={newHighlightCoverPreview} alt="Cover Preview" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <svg className="w-5 h-5 text-[#8B948F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    ref={highlightFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setNewHighlightCover(file);
                                            setNewHighlightCoverPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="hidden"
                                />
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={newHighlightTitle}
                                        onChange={(e) => setNewHighlightTitle(e.target.value)}
                                        placeholder="Highlight title..."
                                        maxLength={50}
                                        required
                                        className="w-full bg-[#0B0F0D] border border-[#1F2923] focus:border-[#22C55E] text-[#F5F7F5] rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none"
                                    />
                                    <p className="text-[10px] text-[#8B948F] mt-1">
                                        {newHighlightCoverPreview ? 'Custom cover selected' : 'Cover Image (Optional)'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={highlightProcessing || !newHighlightTitle.trim()}
                                className="w-full py-3 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] rounded-xl text-xs sm:text-sm font-bold transition disabled:opacity-50 shadow-lg"
                            >
                                {highlightProcessing ? 'Creating...' : 'Create & Add Story'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
