import RatingModal from '@/Components/RatingModal';
import ConfirmModal from '@/Components/ConfirmModal';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function MyReviewTab({ myReviews }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const goToGame = (slug) => {
        router.get(route('games.show', slug));
    };

    const confirmDeleteReview = () => {
        router.delete(route('reviews.destroy', reviewToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setReviewToDelete(null);
                setSelectedReview(null);
            },
        });
    };

    if (myReviews.length === 0) {
        return (
            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center">
                <p className="text-[#8B948F] text-sm">
                    You haven't reviewed any games yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-[#F5F7F5] text-lg font-semibold mb-4">
                My Reviews ({myReviews.length})
            </h2>

            <div className="space-y-3">
                {myReviews.map((review) => (
                    <div
                        key={review.id}
                        onClick={() => setSelectedReview(review)}
                        className="cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-3 flex items-center gap-4 hover:border-[#2E3A32] transition"
                    >
                        <img
                            src={review.game.cover_url}
                            alt={review.game.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            <h3 className="text-[#F5F7F5] text-sm font-medium truncate">
                                {review.game.title}
                            </h3>
                            <p className="text-[#5A625D] text-xs mt-1">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>

                        <span className="text-[#22C55E] text-sm font-semibold shrink-0 flex items-center gap-1">
                            {Number(review.rating).toFixed(1)}
                            <span>★</span>
                        </span>
                    </div>
                ))}
            </div>

            {selectedReview && !showEditModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
                    onClick={() => setSelectedReview(null)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-xl overflow-hidden max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedReview.game.cover_url}
                            alt={selectedReview.game.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-[#F5F7F5] text-lg font-semibold mb-1">
                                {selectedReview.game.title}
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#22C55E] text-2xl font-bold">
                                        {Number(selectedReview.rating).toFixed(1)}
                                    </span>
                                    <span className="text-[#5A625D] text-sm">/ 10</span>
                                    <span className="text-[#22C55E] text-lg">★</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="text-[#8B948F] hover:text-[#22C55E] transition"
                                        title="Edit review"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setReviewToDelete(selectedReview.id)}
                                        className="text-[#8B948F] hover:text-red-400 transition"
                                        title="Delete review"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {selectedReview.body && (
                                <p className="text-[#8B948F] text-sm leading-relaxed mb-6">
                                    {selectedReview.body}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="flex-1 rounded-lg border border-[#1F2923] text-[#8B948F] py-2.5 text-sm hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => goToGame(selectedReview.game.slug)}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="flex-1 rounded-lg font-medium py-2.5 text-sm hover:opacity-90 transition"
                                >
                                    View Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedReview && (
                <RatingModal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedReview(null);
                    }}
                    gameSlug={selectedReview.game.slug}
                    existingReview={selectedReview}
                />
            )}

            <ConfirmModal
                show={reviewToDelete !== null}
                title="Delete Review?"
                message="Are you sure you want to delete this review? This cannot be undone."
                onConfirm={confirmDeleteReview}
                onCancel={() => setReviewToDelete(null)}
            />
        </div>
    );
}