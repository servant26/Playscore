import { router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import { getFallbackImage } from '@/Utils/imageFallback';

export default function GameCard({ game, isInList, onToggleList }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [imgSrc, setImgSrc] = useState(game.cover_url || getFallbackImage(game.title));

    const openTrailer = (e) => {
        e.stopPropagation();
        const query = encodeURIComponent(`${game.title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const handleListClick = (e) => {
        e.stopPropagation();
        if (isInList) {
            setShowConfirm(true);
        } else {
            onToggleList(game.id, game.slug);
        }
    };

    const confirmRemove = () => {
        onToggleList(game.id, game.slug);
        setShowConfirm(false);
    };

    const goToDetail = () => {
        router.get(route('games.show', game.slug));
    };

    return (
        <>
            <div
                onClick={goToDetail}
                className="group cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl overflow-hidden hover:border-[#2E3A32] transition"
            >
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={game.title}
                        onError={() => setImgSrc(getFallbackImage(game.title))}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {game.rawg_rating && (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#0B0F0D]/80 backdrop-blur-sm text-[#22C55E] text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                            ★ {Number(game.rawg_rating).toFixed(1)}
                        </div>
                    )}
                </div>

                <div className="p-2 sm:p-3">
                    <h3 className="text-[#F5F7F5] text-xs sm:text-sm font-medium truncate mb-0.5 sm:mb-1">
                        {game.title}
                    </h3>

                    {game.interests?.length > 0 && (
                        <p className="text-[#5A625D] text-[10px] sm:text-xs truncate mb-2 sm:mb-3">
                            {game.interests.map((i) => i.name).join(', ')}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button
                            onClick={openTrailer}
                            className="w-full sm:flex-1 rounded-md bg-[#1F2923] text-[#8B948F] text-[10px] sm:text-xs font-medium py-1 sm:py-1.5 hover:bg-[#2E3A32] hover:text-[#F5F7F5] transition text-center"
                        >
                            Trailer
                        </button>
                        <button
                            onClick={handleListClick}
                            className={`w-full sm:flex-1 rounded-md text-[10px] sm:text-xs font-medium py-1 sm:py-1.5 transition text-center ${isInList
                                ? 'bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D]'
                                : 'bg-[#1F2923] text-[#8B948F] hover:bg-[#2E3A32] hover:text-[#F5F7F5]'
                                }`}
                        >
                            {isInList ? '✓ In List' : '+ My List'}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showConfirm}
                title="Remove from My List?"
                message={`Are you sure you want to remove "${game.title}" from your list?`}
                onConfirm={confirmRemove}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}