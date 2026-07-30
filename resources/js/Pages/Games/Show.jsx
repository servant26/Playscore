import AppLayout from '@/Layouts/AppLayout';
import GameCard from '@/Components/GameCard';
import RatingModal from '@/Components/RatingModal';
import ShareButton from '@/Components/ShareButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Show({ game, userReview, reviews, moreLikeThis, isInList, myListIds, reviewsCount, averageRating }) {
    const { auth } = usePage().props;
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [inList, setInList] = useState(isInList);
    const [moreListIds, setMoreListIds] = useState(myListIds || []);
    const [pendingChanges, setPendingChanges] = useState({});
    const [showLeaveWarning, setShowLeaveWarning] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(null);

    const toggleMoreListItem = (gameId, gameSlug) => {
        const currentlyIn = moreListIds.includes(gameId);

        setMoreListIds((prev) =>
            currentlyIn ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        );

        setPendingChanges((prev) => ({
            ...prev,
            [gameId]: { slug: gameSlug },
        }));
    };

    const hasPendingChanges = Object.keys(pendingChanges).length > 0;

    const saveChanges = () => {
        const changes = Object.values(pendingChanges);
        setPendingChanges({});

        changes.forEach(({ slug }) => {
            router.post(
                route('game-list.toggle', slug),
                {},
                { preserveScroll: true, preserveState: true }
            );
        });
    };

    const discardChanges = () => {
        setMoreListIds(myListIds || []);
        setPendingChanges({});
    };

    const confirmLeaveWithoutSaving = () => {
        setShowLeaveWarning(false);
        setPendingChanges({});
        if (pendingUrl) {
            window.location.href = pendingUrl;
        }
    };

    const cancelLeave = () => {
        setShowLeaveWarning(false);
        setPendingUrl(null);
    };

    useEffect(() => {
        const removeListener = router.on('before', (event) => {
            const method = event.detail.visit.method;

            if (method !== 'get') {
                return;
            }

            if (hasPendingChanges) {
                event.preventDefault();
                setPendingUrl(event.detail.visit.url.href);
                setShowLeaveWarning(true);
            }
        });

        return () => removeListener();
    }, [hasPendingChanges]);

    const openTrailer = () => {
        const query = encodeURIComponent(`${game.title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const toggleList = () => {
        setInList(!inList);
        router.post(
            route('game-list.toggle', game.slug),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const confirmDeleteReview = () => {
        router.delete(route('reviews.destroy', reviewToDelete), {
            preserveScroll: true,
            onSuccess: () => setReviewToDelete(null),
        });
    };

    return (
        <AppLayout>
            <Head title={game.title} />

            <div className="max-w-5xl mx-auto">
                {/* Cover */}
                <div className="relative rounded-xl overflow-hidden mb-6" style={{ maxHeight: '480px' }}>
                    <img
                        src={game.cover_url}
                        alt={game.title}
                        className="w-full object-cover"
                        style={{ height: '480px' }}
                    />
                </div>

                {/* Info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-[#F5F7F5] text-2xl font-semibold mb-2">
                            {game.title}
                        </h1>
                        <div className="flex items-center gap-3 text-sm text-[#8B948F]">
                            {game.rawg_rating && (
                                <span className="text-[#22C55E] font-semibold">
                                    ★ {Number(game.rawg_rating).toFixed(1)}
                                </span>
                            )}
                            {game.release_date && (
                                <span>{new Date(game.release_date).getFullYear()}</span>
                            )}
                            {game.interests?.length > 0 && (
                                <span>{game.interests.map((i) => i.name).join(', ')}</span>
                            )}
                        </div>
                    </div>
                    <ShareButton url={window.location.href} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={openTrailer}
                        className="rounded-lg bg-[#1F2923] text-[#F5F7F5] px-6 py-2.5 text-sm font-medium hover:bg-[#2E3A32] transition"
                    >
                        Trailer
                    </button>
                    <button
                        onClick={toggleList}
                        className={`rounded-lg px-6 py-2.5 text-sm font-medium transition ${inList
                            ? 'bg-[#22C55E] text-[#0B0F0D]'
                            : 'bg-[#1F2923] text-[#F5F7F5] hover:bg-[#2E3A32]'
                            }`}
                    >
                        {inList ? '✓ In List' : '+ My List'}
                    </button>
                    {userReview ? (
                        <button
                            onClick={() => setShowRatingModal(true)}
                            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-6 py-2.5 text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition flex items-center gap-2"
                        >
                            <span>Your Rating :</span>
                            <span className="text-[#22C55E] font-semibold">
                                {userReview.rating} ★
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowRatingModal(true)}
                            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-6 py-2.5 text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                        >
                            Give Rating
                        </button>
                    )}
                </div>

                {/* Description */}
                {game.description && (
                    <p className="text-[#8B948F] text-sm leading-relaxed mb-8">
                        {game.description}
                    </p>
                )}

                {/* Rating summary */}
                <div className="flex items-center gap-6 mb-10 bg-[#131916] border border-[#1F2923] rounded-xl p-5">
                    <div className="text-center">
                        <p className="text-[#22C55E] text-3xl font-bold">{averageRating}</p>
                        <p className="text-[#5A625D] text-xs">out of 5</p>
                    </div>
                    <div className="text-[#8B948F] text-sm">
                        Based on {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
                    </div>
                </div>

                {/* More Like This */}
                {moreLikeThis.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-[#F5F7F5] text-lg font-semibold mb-4">
                            More Like This
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {moreLikeThis.map((g) => (
                                <div key={g.id} className="w-48 shrink-0">
                                    <GameCard
                                        game={g}
                                        isInList={moreListIds.includes(g.id)}
                                        onToggleList={toggleMoreListItem}
                                    />
                                </div>
                            ))}
                        </div>

                        {hasPendingChanges && (
                            <div className="flex items-center justify-end gap-3 mt-3">
                                <p className="text-[#8B948F] text-sm mr-2">
                                    You have unsaved changes
                                </p>
                                <button
                                    onClick={discardChanges}
                                    className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-sm hover:border-[#2E3A32] transition"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={saveChanges}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="rounded-lg font-medium px-5 py-2 text-sm hover:opacity-90 transition"
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* Reviews */}
                <section>
                    <h2 className="text-[#F5F7F5] text-lg font-semibold mb-4">
                        Reviews ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <p className="text-[#5A625D] text-sm text-center py-8">
                            No reviews yet. Be the first to review this game!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="relative bg-[#131916] border border-[#1F2923] rounded-xl p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-11 h-11 aspect-square rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm font-semibold overflow-hidden shrink-0"
                                            style={{ minWidth: '44px', minHeight: '44px' }}
                                        >
                                            {review.user.avatar ? (
                                                <img
                                                    src={`/storage/${review.user.avatar}`}
                                                    alt={review.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                review.user.name.slice(0, 2).toUpperCase()
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[#F5F7F5] text-sm font-medium">
                                                    {review.user.name}
                                                </p>
                                                <span className="text-[#22C55E] text-sm font-semibold">
                                                    ★ {review.rating} / 5
                                                </span>
                                            </div>

                                            {review.user.id === auth.user.id && (
                                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                    <button
                                                        onClick={() => setShowRatingModal(true)}
                                                        className="text-[#8B948F] hover:text-[#22C55E] transition"
                                                        title="Edit review"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewToDelete(review.id)}
                                                        className="text-[#8B948F] hover:text-red-400 transition"
                                                        title="Delete review"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            <p className="text-[#5A625D] text-xs mt-1">
                                                {new Date(review.created_at).toLocaleString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-[#8B948F] text-sm mt-2">{review.body}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <RatingModal
                show={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                gameSlug={game.slug}
                existingReview={userReview}
            />

            <ConfirmModal
                show={showLeaveWarning}
                title="Unsaved Changes"
                message="You have unsaved changes to your list. Are you sure you want to leave without saving?"
                onConfirm={confirmLeaveWithoutSaving}
                onCancel={cancelLeave}
                cancelLabel="Back"
                confirmLabel="Yes"
            />

            <ConfirmModal
                show={reviewToDelete !== null}
                title="Delete Review?"
                message="Are you sure you want to delete your review? This cannot be undone."
                onConfirm={confirmDeleteReview}
                onCancel={() => setReviewToDelete(null)}
            />
        </AppLayout>
    );
}