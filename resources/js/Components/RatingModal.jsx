import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import LoadingDots from '@/Components/LoadingDots';

export default function RatingModal({ show, onClose, gameSlug, existingReview }) {
    const { data, setData, post, processing, reset } = useForm({
        rating: existingReview?.rating || 0,
        body: existingReview?.body || '',
        post_to_story: true,
    });

    useEffect(() => {
        if (show) {
            setData({
                rating: existingReview?.rating || 0,
                body: existingReview?.body || '',
                post_to_story: true,
            });
        }
    }, [show, existingReview]);

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
                    <div className="text-center mb-4">
                        <span className="text-[#22C55E] text-4xl font-bold">
                            {Number(data.rating).toFixed(1)}
                        </span>
                        <span className="text-[#5A625D] text-lg"> / 10</span>
                        <span className="text-[#22C55E] text-2xl ml-1">★</span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={data.rating}
                        onChange={(e) => setData('rating', parseFloat(e.target.value))}
                        className="w-full mb-5 accent-[#22C55E]"
                    />

                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        rows={4}
                        placeholder="Share your thoughts about this game (optional)..."
                        className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none mb-4 custom-scrollbar"
                    />

                    <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.post_to_story}
                            onChange={(e) => setData('post_to_story', e.target.checked)}
                            className="w-4 h-4 rounded border-[#1F2923] bg-[#0B0F0D] text-[#22C55E] focus:ring-[#22C55E] focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-[#F5F7F5] font-medium">
                            Post to Story <span className="text-[#8B948F] text-xs font-normal">(visible for 24h)</span>
                        </span>
                    </label>

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
                            disabled={processing || data.rating === 0}
                            style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                            className="flex-1 rounded-lg font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <LoadingDots text="Submitting" />
                            ) : (
                                <span>Submit</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}