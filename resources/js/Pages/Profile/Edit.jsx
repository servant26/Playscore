import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import StoryBar from '@/Components/StoryBar';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ProfileTab from './Partials/ProfileTab';
import InterestTab from './Partials/InterestTab';
import GameListTab from './Partials/GameListTab';
import MyReviewTab from './Partials/MyReviewTab';
import StatsTab from './Partials/StatsTab';
import FollowListTab from './Partials/FollowListTab';

export default function Edit({
    mustVerifyEmail,
    status,
    followersCount = 0,
    followingCount = 0,
    allInterests,
    userInterestIds,
    recommendations,
    gameList,
    myReviews,
    myStories = [],
    followingStoryGroups = [],
    stats,
}) {
    const authUser = usePage().props.auth.user;

    const TABS = [
        { key: 'profile', label: 'Profile' },
        { key: 'interest', label: 'Interest' },
        { key: 'gamelist', label: 'Gamelist' },
        { key: 'myreview', label: 'My Review' },
        { key: 'stats', label: 'Stats' },
        { key: 'following', label: 'Following' },
        { key: 'followers', label: 'Followers' },
    ];
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            const validKeys = TABS.map((t) => t.key);
            if (hash && validKeys.includes(hash)) {
                return hash;
            }
            const stored = localStorage.getItem('playscore_profile_tab');
            if (stored && validKeys.includes(stored)) {
                return stored;
            }
        }
        return 'profile';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('playscore_profile_tab', activeTab);
            if (window.location.hash !== `#${activeTab}`) {
                window.history.replaceState(null, '', `#${activeTab}`);
            }
        }
    }, [activeTab]);

    const initialGameListIds = gameList.map((g) => g.id);
    const [listIds, setListIds] = useState(initialGameListIds);
    const [pendingChanges, setPendingChanges] = useState({});
    const [showLeaveWarning, setShowLeaveWarning] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const hasPendingChanges = Object.keys(pendingChanges).length > 0;

    const toggleList = (gameId, gameSlug) => {
        const currentlyIn = listIds.includes(gameId);

        setListIds((prev) =>
            currentlyIn ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        );

        setPendingChanges((prev) => ({
            ...prev,
            [gameId]: { slug: gameSlug },
        }));
    };

    const saveChanges = () => {
        const changes = Object.values(pendingChanges);
        setPendingChanges({});

        changes.forEach(({ slug }) => {
            router.post(
                route('game-list.toggle', slug),
                {},
                { preserveScroll: true, preserveState: true }
            );
        });
    };

    const discardChanges = () => {
        setListIds(initialGameListIds);
        setPendingChanges({});
    };

    const handleTabChange = (tabKey) => {
        if (hasPendingChanges) {
            setPendingAction({ type: 'tab', value: tabKey });
            setShowLeaveWarning(true);
        } else {
            setActiveTab(tabKey);
        }
    };

    const confirmLeaveWithoutSaving = () => {
        setShowLeaveWarning(false);
        setPendingChanges({});

        if (pendingAction?.type === 'tab') {
            setActiveTab(pendingAction.value);
        } else if (pendingAction?.type === 'url') {
            window.location.href = pendingAction.value;
        }

        setPendingAction(null);
    };

    const cancelLeave = () => {
        setShowLeaveWarning(false);
        setPendingAction(null);
    };

    useEffect(() => {
        const removeListener = router.on('before', (event) => {
            const method = event.detail.visit.method;

            if (method !== 'get') {
                return;
            }

            if (hasPendingChanges) {
                event.preventDefault();
                setPendingAction({ type: 'url', value: event.detail.visit.url.href });
                setShowLeaveWarning(true);
            }
        });

        return () => removeListener();
    }, [hasPendingChanges]);

    return (
        <AppLayout>
            <Head title="Profile" />

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <aside className="w-full lg:w-56 shrink-0">
                    <nav className="flex lg:flex-col overflow-x-auto pb-2 lg:pb-0 gap-1.5 scrollbar-none">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`text-left whitespace-nowrap px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition ${activeTab === tab.key
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] bg-[#131916]/60 lg:bg-transparent hover:bg-[#131916] hover:text-[#F5F7F5]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">
                    {activeTab === 'profile' && (
                        <ProfileTab
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            followersCount={followersCount}
                            followingCount={followingCount}
                        />
                    )}
                    {activeTab === 'interest' && (
                        <InterestTab
                            allInterests={allInterests}
                            userInterestIds={userInterestIds}
                            recommendations={recommendations}
                            listIds={listIds}
                            pendingChanges={pendingChanges}
                            onToggleList={toggleList}
                            onSave={saveChanges}
                            onDiscard={discardChanges}
                        />
                    )}
                    {activeTab === 'gamelist' && <GameListTab gameList={gameList} />}
                    {activeTab === 'myreview' && <MyReviewTab myReviews={myReviews} />}
                    {activeTab === 'followers' && <FollowListTab user={authUser} type="followers" />}
                    {activeTab === 'following' && <FollowListTab user={authUser} type="following" />}
                    {activeTab === 'stats' && (
                        <StatsTab stats={stats} myReviews={myReviews} onSelectTab={handleTabChange} />
                    )}
                </div>
            </div>

            <ConfirmModal
                show={showLeaveWarning}
                title="Unsaved Changes"
                message="You have unsaved changes to your list. Are you sure you want to leave without saving?"
                onConfirm={confirmLeaveWithoutSaving}
                onCancel={cancelLeave}
                cancelLabel="Back"
                confirmLabel="Yes"
            />
        </AppLayout>
    );
}