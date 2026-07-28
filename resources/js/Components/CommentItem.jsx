import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CommentItem({ comment, gameSlug, onDeleteRequest }) {
    const { auth } = usePage().props;
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);

    const { data, setData, post, processing, reset } = useForm({
        body: '',
        parent_id: comment.id,
    });

    const submitReply = (e) => {
        e.preventDefault();
        post(route('comments.store', gameSlug), {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');
                setShowReplyForm(false);
            },
        });
    };

    const initials = comment.user.name.slice(0, 2).toUpperCase();
    const replyCount = comment.replies?.length || 0;
    const isOwnComment = comment.user.id === auth.user.id;

    return (
        <div>
            <div className="flex items-start gap-3">
                <div
                    className="w-10 h-10 aspect-square rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm font-semibold overflow-hidden shrink-0"
                    style={{ minWidth: '40px', minHeight: '40px' }}
                >
                    {comment.user.avatar ? (
                        <img
                            src={`/storage/${comment.user.avatar}`}
                            alt={comment.user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        initials
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
                        {isOwnComment && (
                            <button
                                onClick={() => onDeleteRequest(comment.id)}
                                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                                className="rounded-md px-3 py-1 text-xs font-medium hover:opacity-90 transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <p className="text-[#8B948F] text-sm mt-2">{comment.body}</p>

                    <div className="flex items-center gap-4 mt-2">
                        {!isOwnComment && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-[#22C55E] text-xs font-medium hover:text-[#4ADE80] transition"
                            >
                                Reply
                            </button>
                        )}
                        {replyCount > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-[#5A625D] text-xs hover:text-[#8B948F] transition"
                            >
                                {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <form onSubmit={submitReply} className="mt-3">
                            <textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows={2}
                                placeholder={`Reply to ${comment.user.name}...`}
                                className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none mb-2"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReplyForm(false)}
                                    className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-1.5 text-xs hover:border-[#2E3A32] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.body}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="rounded-lg font-medium px-4 py-1.5 text-xs hover:opacity-90 transition disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </div>
                        </form>
                    )}

                    {showReplies && replyCount > 0 && (
                        <div className="mt-4 space-y-4 border-l-2 border-[#1F2923] pl-4">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    gameSlug={gameSlug}
                                    onDeleteRequest={onDeleteRequest}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}