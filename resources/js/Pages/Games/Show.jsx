import AppLayout from '@/Layouts/AppLayout';
import GameCard from '@/Components/GameCard';
import RatingModal from '@/Components/RatingModal';
import ShareButton from '@/Components/ShareButton';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ game, userReview, moreLikeThis, isInList, reviewsCount, averageRating }) {
    const { auth } = usePage().props;
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [inList, setInList] = useState(isInList);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const { data, setData, post, processing, reset } = useForm({ body: '' });

    const openTrailer = () => {
        const query = encodeURIComponent(`${game.title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const toggleList = () => {
        setInList(!inList);
        router.post(
            route('game-list.toggle', game.id),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const submitComment = (e) => {
        e.preventDefault();
        post(route('comments.store', game.slug), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const confirmDeleteComment = () => {
        router.delete(route('comments.destroy', commentToDelete), {
            preserveScroll: true,
            onSuccess: () => setCommentToDelete(null),
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
                <div className="flex gap-3 mb-6">
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
                    <button
                        onClick={() => setShowRatingModal(true)}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-6 py-2.5 text-sm font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                    >
                        {userReview ? 'Edit Rating' : 'Give Rating'}
                    </button>
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
                                    <GameCard game={g} isInList={false} onToggleList={() => { }} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Comments */}
                <section>
                    <h2 className="text-[#F5F7F5] text-lg font-semibold mb-4">
                        Comments ({game.comments?.length || 0})
                    </h2>

                    <form onSubmit={submitComment} className="mb-6">
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={2}
                            placeholder="Add a comment..."
                            className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none mb-2"
                        />
                        <button
                            type="submit"
                            disabled={processing || !data.body}
                            style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                            className="rounded-lg font-medium px-6 py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                        >
                            Post Comment
                        </button>
                    </form>

                    <div className="space-y-4">
                        {game.comments?.map((comment) => (
                            <div
                                key={comment.id}
                                className="bg-[#131916] border border-[#1F2923] rounded-xl p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-11 h-11 aspect-square rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm font-semibold overflow-hidden shrink-0" style={{ minWidth: '44px', minHeight: '44px' }}>
                                        {comment.user.avatar ? (
                                            <img
                                                src={`/storage/${comment.user.avatar}`}
                                                alt={comment.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            comment.user.name.slice(0, 2).toUpperCase()
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[#F5F7F5] text-sm font-medium leading-tight">
                                                    {comment.user.name}
                                                </p>
                                                <p className="text-[#5A625D] text-xs mt-1">
                                                    {new Date(comment.created_at).toLocaleString('en-US', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            {comment.user.id === auth.user.id && (
                                                <button
                                                    onClick={() => setCommentToDelete(comment.id)}
                                                    style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                                                    className="rounded-md px-3 py-1 text-xs font-medium hover:opacity-90 transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[#8B948F] text-sm mt-2">{comment.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!game.comments || game.comments.length === 0) && (
                            <p className="text-[#5A625D] text-sm text-center py-8">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </section>
            </div>

            <RatingModal
                show={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                gameSlug={game.slug}
                existingReview={userReview}
            />

            <ConfirmModal
                show={commentToDelete !== null}
                title="Delete Comment?"
                message="Are you sure you want to delete this comment? This cannot be undone."
                onConfirm={confirmDeleteComment}
                onCancel={() => setCommentToDelete(null)}
            />
        </AppLayout>
    );
}