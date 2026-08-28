import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import { getFallbackImage } from '@/Utils/imageFallback';

export default function RawgGameCard({ game, isInList: initialIsInList = false, onToggleList }) {
    const [imgSrc, setImgSrc] = useState(game.cover_url || getFallbackImage(game.title));
    const [inList, setInList] = useState(initialIsInList);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setInList(initialIsInList);
    }, [initialIsInList]);

    const openTrailer = (e) => {
        e.stopPropagation();
        const query = encodeURIComponent(`${game.title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const handleListClick = (e) => {
        e.stopPropagation();
        if (inList) {
            setShowConfirm(true);
        } else {
            toggleList();
        }
    };

    const toggleList = () => {
        const nextState = !inList;
        setInList(nextState);

        if (onToggleList) {
            onToggleList(game.external_id || game.id, game.slug);
        } else {
            setLoading(true);
            router.post(
                route('game-list.toggle', game.external_id || game.slug || game.id),
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setLoading(false),
                }
            );
        }
    };

    const confirmRemove = () => {
        toggleList();
        setShowConfirm(false);
    };

    const goToDetail = () => {
        router.get(route('games.import-and-show', game.external_id));
    };

    return (
        <>
            <div
                onClick={goToDetail}
                className="group cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl overflow-hidden hover:border-[#2E3A32] transition flex flex-col"
            >
                {/* Cover Image with Title & Genre Hover Overlay (Portrait / Game Box Cover 3:4) */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0B0F0D]">
                    <img
                        src={imgSrc}
                        alt={game.title}
                        onError={() => setImgSrc(getFallbackImage(game.title))}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Rating Badge */}
                    {game.rawg_rating && (
                        <div className="absolute top-2 right-2 bg-[#0B0F0D]/85 backdrop-blur-sm text-[#22C55E] text-xs font-semibold px-2 py-1 rounded-md z-10">
                            ★ {Number(game.rawg_rating).toFixed(1)}
                        </div>
                    )}

                    {/* Popular Badge */}
                    {(game.is_popular || (Number(game.rawg_rating) >= 4.2)) && (
                        <div className="absolute top-2 left-2 bg-[#EF4444] px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>Popular</span>
                        </div>
                    )}

                    {/* Hover Title & Genre Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D]/95 via-[#0B0F0D]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-4 flex flex-col justify-end pointer-events-none">
                        <h3 className="text-[#F5F7F5] text-sm sm:text-base font-bold line-clamp-2 leading-tight">
                            {game.title}
                        </h3>
                        {game.genres && (
                            <p className="text-[#22C55E] text-xs font-medium truncate mt-1">
                                {game.genres}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="p-2 sm:p-3 flex gap-2 border-t border-[#1F2923]/60 bg-[#131916]">
                    <button
                        onClick={openTrailer}
                        className="flex-1 rounded-md bg-[#1F2923] text-[#8B948F] text-xs font-medium py-2 hover:bg-[#2E3A32] hover:text-[#F5F7F5] transition text-center"
                    >
                        Trailer
                    </button>
                    <button
                        onClick={handleListClick}
                        disabled={loading}
                        className={`flex-1 rounded-md text-xs font-medium py-2 transition text-center ${
                            inList
                                ? 'bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D]'
                                : 'bg-[#1F2923] text-[#8B948F] hover:bg-[#2E3A32] hover:text-[#F5F7F5]'
                        }`}
                    >
                        {inList ? '✓ In List' : '+ My List'}
                    </button>
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