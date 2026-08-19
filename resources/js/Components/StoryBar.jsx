import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import StoryViewerModal from '@/Components/StoryViewerModal';

export default function StoryBar({ myStories = [], followingStoryGroups = [], isInline = false }) {
    const authUser = usePage().props.auth.user;
    const [viewerState, setViewerState] = useState({ show: false, stories: [], index: 0 });
    const [viewedIds, setViewedIds] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('playscore_viewed_stories');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const handleStoryViewed = (storyId) => {
        setViewedIds((prev) => {
            if (prev.includes(storyId)) return prev;
            const updated = [...prev, storyId];
            try {
                localStorage.setItem('playscore_viewed_stories', JSON.stringify(updated));
            } catch {}
            return updated;
        });
    };

    const initials = authUser.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const hasMyStories = myStories && myStories.length > 0;
    const myHasUnviewed = hasMyStories && myStories.some((s) => !viewedIds.includes(s.id));

    const openMyStories = () => {
        if (hasMyStories) {
            setViewerState({ show: true, stories: myStories, index: 0 });
        }
    };

    const openGroupStories = (group) => {
        if (group && group.stories && group.stories.length > 0) {
            setViewerState({ show: true, stories: group.stories, index: 0 });
        }
    };

    const circleSize = 'w-14 h-14 sm:w-16 sm:h-16';

    return (
        <>
            <div className={isInline ? "shrink-0 min-w-0" : "w-full mb-6"}>
                <div className="flex items-center gap-3.5 overflow-x-auto py-2 px-1.5 hide-scrollbar scrollbar-none">
                    {/* Far Left: My Story Circle */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={openMyStories}
                            disabled={!hasMyStories}
                            className={`relative ${circleSize} rounded-full transition shrink-0 ${
                                !hasMyStories
                                    ? 'border-2 border-dashed border-[#1F2923] cursor-default opacity-80'
                                    : myHasUnviewed
                                    ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] cursor-pointer hover:scale-105'
                                    : 'border-2 border-[#1F2923] cursor-pointer opacity-75 hover:scale-105'
                            }`}
                        >
                            <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                {authUser.avatar ? (
                                    <img
                                        src={`/storage/${authUser.avatar}`}
                                        alt={authUser.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className={myHasUnviewed ? "text-[#22C55E] text-xs sm:text-sm font-bold" : "text-[#8B948F] text-xs sm:text-sm font-bold"}>
                                        {initials}
                                    </span>
                                )}
                            </div>

                            {hasMyStories ? (
                                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B0F0D] flex items-center justify-center text-[10px] font-bold ${
                                    myHasUnviewed ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                }`}>
                                    {myStories.length}
                                </span>
                            ) : (
                                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#1F2923] border-2 border-[#0B0F0D] flex items-center justify-center text-[10px] text-[#8B948F]">
                                    +
                                </span>
                            )}
                        </button>
                        <span className="text-[11px] font-medium text-[#F5F7F5] truncate max-w-[64px] text-center">
                            My Story
                        </span>
                    </div>

                    {/* Divider */}
                    {followingStoryGroups.length > 0 && (
                        <div className="h-10 w-[1px] bg-[#1F2923] shrink-0 my-auto" />
                    )}

                    {/* Following Users Stories */}
                    {followingStoryGroups.map((group) => {
                        const storyInitials = group.user_name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();

                        const groupHasUnviewed = group.stories.some((s) => !viewedIds.includes(s.id));

                        return (
                            <div key={group.user_id} className="flex flex-col items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => openGroupStories(group)}
                                    className={`relative ${circleSize} rounded-full transition shrink-0 ${
                                        groupHasUnviewed
                                            ? 'p-[2.5px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] cursor-pointer hover:scale-105'
                                            : 'border-2 border-[#1F2923] cursor-pointer opacity-75 hover:scale-105'
                                    }`}
                                >
                                    <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                        {group.user_avatar ? (
                                            <img
                                                src={`/storage/${group.user_avatar}`}
                                                alt={group.user_name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className={groupHasUnviewed ? "text-[#22C55E] text-xs sm:text-sm font-bold" : "text-[#8B948F] text-xs sm:text-sm font-bold"}>
                                                {storyInitials}
                                            </span>
                                        )}
                                    </div>
                                    {group.stories.length > 0 && (
                                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B0F0D] flex items-center justify-center text-[9px] font-bold ${
                                            groupHasUnviewed ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                        }`}>
                                            {group.stories.length}
                                        </span>
                                    )}
                                </button>
                                <span className="text-[11px] font-medium text-[#8B948F] truncate max-w-[64px] text-center">
                                    {group.user_name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Story Viewer Modal */}
            <StoryViewerModal
                show={viewerState.show}
                stories={viewerState.stories}
                initialIndex={viewerState.index}
                onClose={() => setViewerState({ show: false, stories: [], index: 0 })}
                onStoryViewed={handleStoryViewed}
            />
        </>
    );
}
