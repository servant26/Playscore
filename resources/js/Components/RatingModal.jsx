import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function RatingModal({ show, onClose, gameSlug, existingReview }) {
    const [hoverRating, setHoverRating] = useState(0);
    const { data, setData, post, processing, reset } = useForm({
        rating: existingReview?.rating || 0,
        body: existingReview?.body || '',
    });

    if (!show) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('reviews.store', gameSlug), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-[#F5F7F5] text-lg font-semibold mb-4">
                    {existingReview ? 'Update Your Rating' : 'Give Rating'}
                </h3>

                <form onSubmit={submit}>
                    <div className="flex justify-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setData('rating', star)}
                                className="text-3xl transition"
                            >
                                <span
                                    className={
                                        star <= (hoverRating || data.rating)
                                            ? 'text-[#22C55E]'
                                            : 'text-[#2E3A32]'
                                    }
                                >
                                    ★
                                </span>
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-[#8B948F] text-sm mb-5">
                        {data.rating > 0 ? `${data.rating} / 5` : 'Tap to rate'}
                    </p>

                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        rows={4}
                        placeholder="Share your thoughts about this game..."
                        className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none mb-5"
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-[#1F2923] text-[#8B948F] py-2.5 text-sm hover:border-[#2E3A32] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || data.rating === 0 || !data.body}
                            style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                            className="flex-1 rounded-lg font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}