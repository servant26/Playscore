import GameCard from '@/Components/GameCard';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function InterestTab({
    allInterests,
    userInterestIds,
    recommendations,
    listIds,
    pendingChanges,
    onToggleList,
    onSave,
    onDiscard,
}) {
    const [selectedIds, setSelectedIds] = useState(userInterestIds || []);
    const [saving, setSaving] = useState(false);

    const toggleInterest = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const saveInterests = () => {
        setSaving(true);
        router.post(
            route('interests.update'),
            { interests: selectedIds },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            }
        );
    };

    const hasInterestChanges =
        JSON.stringify([...selectedIds].sort()) !==
        JSON.stringify([...(userInterestIds || [])].sort());

    const hasPendingListChanges = Object.keys(pendingChanges).length > 0;

    return (
        <div className="space-y-8">
            <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-6">
                <h2 className="text-[#F5F7F5] text-lg font-semibold mb-1">Your Interests</h2>
                <p className="text-[#8B948F] text-sm mb-5">
                    Pick genres you're into. Recommendations below are based on these.
                </p>

                {/* Interests Badges: vertical scroll limited strictly on mobile (< sm), full height on tab/PC */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 max-h-28 sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 custom-scrollbar">
                    {allInterests.map((interest) => {
                        const active = selectedIds.includes(interest.id);
                        return (
                            <button
                                key={interest.id}
                                type="button"
                                onClick={() => toggleInterest(interest.id)}
                                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm border transition duration-200 ${active
                                    ? 'bg-[#22C55E] border-[#22C55E] text-[#0B0F0D] font-semibold shadow-[0_0_12px_rgba(34,197,94,0.35)] hover:bg-[#16A34A] hover:border-[#16A34A]'
                                    : 'bg-[#0B0F0D] border-[#1F2923] text-[#8B948F] hover:bg-[#131916] hover:border-[#22C55E] hover:text-[#22C55E]'
                                    }`}
                            >
                                {interest.name}
                            </button>
                        );
                    })}
                </div>

                {hasInterestChanges && (
                    <button
                        onClick={saveInterests}
                        disabled={saving}
                        style={{ backgroundColor: '#22C55E', color: '#0B0F0D', minWidth: '130px' }}
                        className="rounded-lg font-semibold py-2 text-xs sm:text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Interests'}
                    </button>
                )}
            </section>

            <section>
                <h2 className="text-[#F5F7F5] text-base sm:text-lg font-semibold mb-4">
                    Recommended For You
                </h2>

                {recommendations.length === 0 ? (
                    <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-8 sm:p-12 text-center">
                        <p className="text-[#8B948F] text-sm">
                            No recommendations yet. Pick some interests above to get started.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 custom-scrollbar snap-x snap-mandatory px-4 sm:px-6 lg:px-0 -mx-4 sm:-mx-6 lg:mx-0 scroll-px-4 sm:scroll-px-6">
                            <div className="flex-shrink-0 w-1 sm:w-2 lg:hidden" />
                            {recommendations.map((game) => (
                                <div key={game.id} className="w-32 sm:w-44 lg:w-48 shrink-0 snap-start">
                                    <GameCard
                                        game={game}
                                        isInList={listIds.includes(game.id)}
                                        onToggleList={onToggleList}
                                    />
                                </div>
                            ))}
                            <div className="flex-shrink-0 w-1 sm:w-2 lg:hidden" />
                        </div>

                        {hasPendingListChanges && (
                            <div className="flex items-center justify-end gap-3 mt-3">
                                <p className="text-[#8B948F] text-sm mr-2">
                                    You have unsaved changes
                                </p>
                                <button
                                    onClick={onDiscard}
                                    className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-sm hover:border-[#2E3A32] transition"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={onSave}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="rounded-lg font-medium px-5 py-2 text-sm hover:opacity-90 transition"
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}