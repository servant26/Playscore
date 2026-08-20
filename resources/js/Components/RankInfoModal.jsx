import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RANKS, getRankInfo } from '@/Utils/rankSystem';

export default function RankInfoModal({ show, onClose, reviewCount = 0 }) {
    const { count, index: activeIndex, currentRank, nextRank, isMax, reviewsNeeded } = getRankInfo(reviewCount);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, onClose]);

    if (!show || typeof document === 'undefined') return null;

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop: Solid dark with heavy blur to isolate the modal content completely */}
            <div
                className="fixed inset-0 bg-[#050706]/92 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-lg bg-[#131916] border border-[#1F2923] rounded-2xl shadow-2xl p-4 sm:p-5 text-[#F5F7F5] transform transition-all duration-300 scale-100 my-auto">
                {/* Header: Clean text header (no trophy icon box) */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F2923]">
                    <div>
                        <h3 className="text-base font-bold text-[#F5F7F5]">Reviewer Rank System</h3>
                        <p className="text-[11px] text-[#8B948F]">
                            Earn ranks by publishing game reviews on Playscore
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#8B948F] hover:text-[#F5F7F5] hover:border-[#2E3A32] flex items-center justify-center transition text-xs font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Current Status Box */}
                <div className="mb-4 p-3.5 rounded-xl bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl">{currentRank.icon}</span>
                        <div>
                            <div className="text-[11px] text-[#8B948F]">Your Current Rank</div>
                            <div className={`text-sm sm:text-base font-bold ${currentRank.color}`}>
                                {currentRank.name}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[11px] text-[#8B948F]">Total Reviews</div>
                        <div className="text-sm sm:text-base font-bold text-[#22C55E]">
                            {count} {count === 1 ? 'Review' : 'Reviews'}
                        </div>
                    </div>
                </div>

                {/* Rank Tiers List: Full description visible with green highlights on key points */}
                <div className="space-y-2.5 max-h-[360px] sm:max-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar mb-4">
                    {RANKS.map((rank, i) => {
                        const isCurrent = i === activeIndex;
                        const isUnlocked = i <= activeIndex;

                        return (
                            <div
                                key={rank.name}
                                className={`p-3 sm:p-3.5 rounded-xl border transition flex items-start sm:items-center gap-3 ${
                                    isCurrent
                                        ? 'bg-[#22C55E]/10 border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                        : isUnlocked
                                        ? 'bg-[#0B0F0D] border-[#1F2923] opacity-90'
                                        : 'bg-[#0B0F0D]/50 border-[#1F2923]/60 opacity-40'
                                }`}
                            >
                                {/* Badge Icon */}
                                <div
                                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 flex items-center justify-center text-xl sm:text-2xl bg-gradient-to-br ${rank.badgeGradient} border border-white/10 shadow-md mt-0.5 sm:mt-0`}
                                >
                                    {rank.icon}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className={`text-xs sm:text-sm font-bold ${rank.color}`}>
                                            {rank.name}
                                        </h4>
                                        {isCurrent && (
                                            <span className="bg-[#22C55E] text-[#0B0F0D] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-[#8B948F] mt-0.5 leading-normal">
                                        {rank.description}
                                    </p>
                                </div>

                                {/* Target Requirement */}
                                <div className="text-right shrink-0">
                                    <div className="text-xs font-bold text-[#F5F7F5]">
                                        {rank.min === 0 ? '0+' : `${rank.min}+`} Reviews
                                    </div>
                                    {isCurrent && !isMax && (
                                        <div className="text-[10px] sm:text-[11px] text-[#22C55E] font-medium mt-0.5">
                                            {reviewsNeeded} needed for next
                                        </div>
                                    )}
                                    {isUnlocked && (
                                        <div className="text-[10px] text-[#22C55E] font-semibold mt-0.5">
                                            ✓ Unlocked
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Button */}
                <div className="flex justify-end pt-2.5 border-t border-[#1F2923]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] text-xs sm:text-sm font-bold transition shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
