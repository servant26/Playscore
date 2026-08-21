import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/Utils/avatar';
import { usePage } from '@inertiajs/react';
import StoryViewerModal from '@/Components/StoryViewerModal';
import Modal from '@/Components/Modal';

export default function StoryBar({ myStories = [], followingStoryGroups = [], isInline = false, isVertical = false }) {
    const authUser = usePage().props.auth.user;
    const [viewerState, setViewerState] = useState({ show: false, stories: [], index: 0 });
    const [showMobileModal, setShowMobileModal] = useState(false);
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
    const anyGroupUnviewed = followingStoryGroups.some((g) => g.stories.some((s) => !viewedIds.includes(s.id)));
    const totalUsersWithStories = (hasMyStories ? 1 : 0) + followingStoryGroups.length;

    const [showGuideModal, setShowGuideModal] = useState(false);

    const openMyStories = () => {
        if (hasMyStories) {
            setViewerState({ show: true, stories: myStories, index: 0 });
        } else {
            setShowGuideModal(true);
        }
    };

    const openGroupStories = (group) => {
        if (group && group.stories && group.stories.length > 0) {
            setViewerState({ show: true, stories: group.stories, index: 0 });
        }
    };

    const circleSize = 'w-12 h-12 sm:w-14 sm:h-14';

    if (isVertical) {
        return (
            <>
                <div className="flex flex-col items-center gap-3.5 overflow-y-auto max-h-[calc(100vh-14rem)] hide-scrollbar scrollbar-none py-1 w-full">
                    {/* My Story Circle */}
                    <div className="relative group shrink-0">
                        <button
                            type="button"
                            onClick={openMyStories}
                            title="My Story"
                            className={`relative ${circleSize} rounded-full transition shrink-0 ${
                                !hasMyStories
                                    ? 'border-2 border-dashed border-[#1F2923] cursor-pointer hover:border-[#22C55E]/60 opacity-80'
                                    : myHasUnviewed
                                    ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] cursor-pointer hover:opacity-100'
                                    : 'border-2 border-[#1F2923] cursor-pointer opacity-75 hover:opacity-100 hover:border-white'
                            }`}
                        >
                            <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                {authUser.avatar ? (
                                    <img
                                        src={getAvatarUrl(authUser.avatar)}
                                        alt={authUser.name}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextSibling) {
                                                e.target.nextSibling.style.display = 'block';
                                            }
                                        }}
                                    />
                                ) : null}
                                <span
                                    style={{ display: authUser.avatar ? 'none' : 'block' }}
                                    className={myHasUnviewed ? "text-[#22C55E] text-xs sm:text-sm font-bold" : "text-[#8B948F] text-xs sm:text-sm font-bold"}
                                >
                                    {initials}
                                </span>
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

                        {/* Hover Tooltip */}
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none whitespace-nowrap">
                            <div className="bg-[#0B0F0D] text-[#F5F7F5] border border-[#1F2923] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xl">
                                My Story
                            </div>
                        </div>
                    </div>

                    {/* Divider if following groups exist */}
                    {followingStoryGroups.length > 0 && (
                        <div className="w-8 h-[1px] bg-[#1F2923] shrink-0 my-0.5" />
                    )}

                    {/* Following Users Story Circles */}
                    {followingStoryGroups.map((group) => {
                        const storyInitials = group.user_name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();

                        const groupHasUnviewed = group.stories.some((s) => !viewedIds.includes(s.id));

                        return (
                            <div key={group.user_id} className="relative group shrink-0">
                                <button
                                    type="button"
                                    onClick={() => openGroupStories(group)}
                                    title={group.user_name}
                                    className={`relative ${circleSize} rounded-full transition shrink-0 ${
                                        groupHasUnviewed
                                            ? 'p-[2.5px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] cursor-pointer hover:opacity-100'
                                            : 'border-2 border-[#1F2923] cursor-pointer opacity-75 hover:opacity-100 hover:border-white'
                                    }`}
                                >
                                    <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                        {group.user_avatar ? (
                                            <img
                                                src={getAvatarUrl(group.user_avatar)}
                                                alt={group.user_name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'block';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <span
                                            style={{ display: group.user_avatar ? 'none' : 'block' }}
                                            className={groupHasUnviewed ? "text-[#22C55E] text-xs sm:text-sm font-bold" : "text-[#8B948F] text-xs sm:text-sm font-bold"}
                                        >
                                            {storyInitials}
                                        </span>
                                    </div>
                                    {group.stories.length > 0 && (
                                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B0F0D] flex items-center justify-center text-[9px] font-bold ${
                                            groupHasUnviewed ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                        }`}>
                                            {group.stories.length}
                                        </span>
                                    )}
                                </button>

                                {/* Hover Tooltip */}
                                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none whitespace-nowrap">
                                    <div className="bg-[#0B0F0D] text-[#F5F7F5] border border-[#1F2923] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xl">
                                        {group.user_name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

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

    return (
        <>
            {/* Desktop & Tablet View (sm: and up): Slidable Circles Row */}
            <div className="hidden sm:flex flex-1 min-w-0 items-center gap-3">
                <div className="h-7 w-[1px] bg-[#1F2923] shrink-0 my-auto" />
                <div className="flex items-center gap-3 sm:gap-3.5 overflow-x-auto py-0.5 px-1 hide-scrollbar scrollbar-none">
                    {/* My Story Circle */}
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                        <button
                            type="button"
                            onClick={openMyStories}
                            className={`relative ${circleSize} rounded-full transition shrink-0 ${
                                !hasMyStories
                                    ? 'border-2 border-dashed border-[#1F2923] cursor-pointer hover:border-[#22C55E]/60 opacity-80'
                                    : myHasUnviewed
                                    ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] cursor-pointer hover:scale-105'
                                    : 'border-2 border-[#1F2923] cursor-pointer opacity-75 hover:scale-105'
                            }`}
                        >
                            <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                {authUser.avatar ? (
                                    <img
                                        src={getAvatarUrl(authUser.avatar)}
                                        alt={authUser.name}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextSibling) {
                                                e.target.nextSibling.style.display = 'block';
                                            }
                                        }}
                                    />
                                ) : null}
                                <span
                                    style={{ display: authUser.avatar ? 'none' : 'block' }}
                                    className={myHasUnviewed ? "text-[#22C55E] text-xs sm:text-sm font-bold" : "text-[#8B948F] text-xs sm:text-sm font-bold"}
                                >
                                    {initials}
                                </span>
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
                        <span className="text-[10px] sm:text-[11px] font-medium text-[#F5F7F5] truncate max-w-[56px] text-center">
                            My Story
                        </span>
                    </div>

                    {/* Divider if following groups exist */}
                    {followingStoryGroups.length > 0 && (
                        <div className="h-7 w-[1px] bg-[#1F2923] shrink-0 my-auto" />
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
                            <div key={group.user_id} className="flex flex-col items-center gap-0.5 shrink-0">
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
                                                src={getAvatarUrl(group.user_avatar)}
                                                alt={group.user_name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'block';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <span
                                            style={{ display: group.user_avatar ? 'none' : 'block' }}
                                            className={groupHasUnviewed ? "text-[#22C55E] text-xs sm:text-sm font-bold" : "text-[#8B948F] text-xs sm:text-sm font-bold"}
                                        >
                                            {storyInitials}
                                        </span>
                                    </div>
                                    {group.stories.length > 0 && (
                                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B0F0D] flex items-center justify-center text-[9px] font-bold ${
                                            groupHasUnviewed ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                        }`}>
                                            {group.stories.length}
                                        </span>
                                    )}
                                </button>
                                <span className="text-[10px] sm:text-[11px] font-medium text-[#8B948F] truncate max-w-[56px] text-center">
                                    {group.user_name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile View (< sm): Compact Trigger Button on the Left */}
            <div className="flex sm:hidden shrink-0">
                <button
                    type="button"
                    onClick={() => setShowMobileModal(true)}
                    className="flex items-center gap-1.5 bg-[#131916] border border-[#1F2923] active:border-[#22C55E] text-[#F5F7F5] px-3.5 py-2 rounded-xl text-xs font-medium transition shrink-0 whitespace-nowrap shadow-sm"
                >
                    <span>Stories</span>
                    {(myHasUnviewed || anyGroupUnviewed) && (
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    )}
                    <svg className="w-3.5 h-3.5 text-[#8B948F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Mobile Stories Drawer / Modal */}
            {showMobileModal && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end justify-center p-0"
                    onClick={() => setShowMobileModal(false)}
                >
                    <div
                        className="bg-[#131916] border-t border-[#1F2923] w-full rounded-t-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#1F2923] pb-3">
                            <h3 className="text-[#F5F7F5] font-semibold text-sm flex items-center gap-2">
                                <span>User Stories</span>
                                <span className="bg-[#1F2923] text-[#8B948F] text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {totalUsersWithStories}
                                </span>
                            </h3>
                            <button
                                onClick={() => setShowMobileModal(false)}
                                className="text-[#8B948F] hover:text-[#F5F7F5] p-1 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Horizontal slidable list inside modal */}
                        <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 hide-scrollbar scrollbar-none">
                            {/* My Story Circle */}
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMobileModal(false);
                                        openMyStories();
                                    }}
                                    className={`relative w-14 h-14 rounded-full transition shrink-0 ${
                                        !hasMyStories
                                            ? 'border-2 border-dashed border-[#1F2923] cursor-pointer opacity-80'
                                            : myHasUnviewed
                                            ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC]'
                                            : 'border-2 border-[#1F2923] opacity-75'
                                    }`}
                                >
                                    <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                        {authUser.avatar ? (
                                            <img
                                                src={getAvatarUrl(authUser.avatar)}
                                                alt={authUser.name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'block';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <span
                                            style={{ display: authUser.avatar ? 'none' : 'block' }}
                                            className={myHasUnviewed ? "text-[#22C55E] text-xs font-bold" : "text-[#8B948F] text-xs font-bold"}
                                        >
                                            {initials}
                                        </span>
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
                                <span className="text-[11px] font-medium text-[#F5F7F5] truncate max-w-[60px] text-center">
                                    My Story
                                </span>
                            </div>

                            {followingStoryGroups.length > 0 && (
                                <div className="h-10 w-[1px] bg-[#1F2923] shrink-0" />
                            )}

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
                                            onClick={() => {
                                                setShowMobileModal(false);
                                                openGroupStories(group);
                                            }}
                                            className={`relative w-14 h-14 rounded-full transition shrink-0 ${
                                                groupHasUnviewed
                                                    ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC]'
                                                    : 'border-2 border-[#1F2923] opacity-75'
                                            }`}
                                        >
                                            <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                                {group.user_avatar ? (
                                                    <img
                                                        src={getAvatarUrl(group.user_avatar)}
                                                        alt={group.user_name}
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) {
                                                                e.target.nextSibling.style.display = 'block';
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                <span
                                                    style={{ display: group.user_avatar ? 'none' : 'block' }}
                                                    className={groupHasUnviewed ? "text-[#22C55E] text-xs font-bold" : "text-[#8B948F] text-xs font-bold"}
                                                >
                                                    {storyInitials}
                                                </span>
                                            </div>
                                            {group.stories.length > 0 && (
                                                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B0F0D] flex items-center justify-center text-[9px] font-bold ${
                                                    groupHasUnviewed ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                                }`}>
                                                    {group.stories.length}
                                                </span>
                                            )}
                                        </button>
                                        <span className="text-[11px] font-medium text-[#8B948F] truncate max-w-[60px] text-center">
                                            {group.user_name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Story Guide Modal */}
            <Modal show={showGuideModal} onClose={() => setShowGuideModal(false)} maxWidth="lg">
                <div className="bg-[#131916] border border-[#1F2923] p-8 sm:p-10 rounded-2xl shadow-2xl text-center">
                    <h3 className="text-[#F5F7F5] font-bold text-xl sm:text-2xl mb-3">
                        How to Create Your Story
                    </h3>

                    <p className="text-[#8B948F] text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                        Stories are generated automatically! To publish a story, you need to <span className="text-[#22C55E] font-semibold">write a game review</span> or <span className="text-[#22C55E] font-semibold">rank up your profile</span> by engaging with the community.
                    </p>

                    <div className="pt-2 max-w-xs mx-auto">
                        <button
                            type="button"
                            onClick={() => setShowGuideModal(false)}
                            className="w-full py-3 px-6 rounded-xl bg-[#22C55E] text-[#0B0F0D] text-sm font-bold hover:bg-[#16A34A] transition shadow-lg tracking-wide"
                        >
                            Got It, Let's Game!
                        </button>
                    </div>
                </div>
            </Modal>

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
