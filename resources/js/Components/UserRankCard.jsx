import { useState } from 'react';
import { getRankInfo } from '@/Utils/rankSystem';
import RankInfoModal from '@/Components/RankInfoModal';

export default function UserRankCard({ reviewCount = 0 }) {
    const [showModal, setShowModal] = useState(false);
    const { count, currentRank, nextRank, progress, isMax, reviewsNeeded } = getRankInfo(reviewCount);

    return (
        <>
            <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-5 sm:p-6 transition hover:border-[#22C55E]/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Rank Badge & Information */}
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-3xl bg-gradient-to-br ${currentRank.badgeGradient} border border-white/10 shadow-md`}
                        >
                            {currentRank.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#8B948F] uppercase tracking-wider">
                                    Gamer Rank
                                </span>
                                <span className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {count} {count === 1 ? 'Review' : 'Reviews'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#F5F7F5] mt-0.5">
                                {currentRank.name}
                            </h3>
                            <p className="text-xs text-[#8B948F] mt-0.5">
                                {currentRank.description}
                            </p>
                        </div>
                    </div>

                    {/* Rank Details Button */}
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#8B948F] hover:border-[#22C55E] hover:text-[#22C55E] text-xs font-semibold transition shrink-0 flex items-center gap-2 self-stretch sm:self-auto justify-center"
                    >
                        <span>Rank Details</span>
                    </button>
                </div>

                {/* Progress Bar towards next rank */}
                <div className="mt-4 pt-4 border-t border-[#1F2923]">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                        <span className="text-[#8B948F]">
                            {isMax ? (
                                <span className="text-[#22C55E] font-bold">Max Rank Achieved! ⚡</span>
                            ) : (
                                <>
                                    Progress to <strong className={nextRank.color}>{nextRank.name}</strong> ({nextRank.min} Reviews)
                                </>
                            )}
                        </span>
                        <span className="text-[#F5F7F5] font-bold">
                            {isMax ? '100%' : `${count} / ${currentRank.target}`}
                        </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#0B0F0D] border border-[#1F2923] overflow-hidden p-[1px]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {!isMax && (
                        <p className="text-[11px] text-[#8B948F] mt-1.5 text-right">
                            Need <span className="text-[#22C55E] font-semibold">{reviewsNeeded} more {reviewsNeeded === 1 ? 'review' : 'reviews'}</span> to reach {nextRank.name}
                        </p>
                    )}
                </div>
            </section>

            {/* Rank Information Modal */}
            <RankInfoModal
                show={showModal}
                onClose={() => setShowModal(false)}
                reviewCount={count}
            />
        </>
    );
}
