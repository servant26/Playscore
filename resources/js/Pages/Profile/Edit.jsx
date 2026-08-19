import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import StoryBar from '@/Components/StoryBar';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import ProfileTab from './Partials/ProfileTab';
import GameListTab from './Partials/GameListTab';
import MyReviewTab from './Partials/MyReviewTab';
import StatsTab from './Partials/StatsTab';
import FollowListTab from './Partials/FollowListTab';

export default function Edit({
    mustVerifyEmail,
    status,
    followersCount = 0,
    followingCount = 0,
    allInterests = [],
    userInterestIds = [],
    recommendations = [],
    gameList = [],
    myReviews = [],
    myStories = [],
    followingStoryGroups = [],
    stats,
}) {
    const authUser = usePage().props.auth.user;

    const TABS = [
        { key: 'profile', label: 'Profile' },
        { key: 'gamelist_review', label: 'Gamelist & Review' },
        { key: 'stats', label: 'Stats' },
        { key: 'follow', label: 'Following & Followers' },
    ];

    const getInitialState = () => {
        let tab = 'profile';
        let gamesSub = 'gamelist';
        let followSub = 'following';

        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'myreview') {
                tab = 'gamelist_review';
                gamesSub = 'myreview';
            } else if (hash === 'gamelist' || hash === 'gamelist_review') {
                tab = 'gamelist_review';
                gamesSub = 'gamelist';
            } else if (hash === 'followers') {
                tab = 'follow';
                followSub = 'followers';
            } else if (hash === 'following' || hash === 'follow') {
                tab = 'follow';
                followSub = 'following';
            } else if (hash === 'stats') {
                tab = 'stats';
            } else if (hash === 'profile' || hash === 'interest') {
                tab = 'profile';
            } else {
                const stored = localStorage.getItem('playscore_profile_tab');
                if (stored === 'gamelist' || stored === 'myreview' || stored === 'gamelist_review') {
                    tab = 'gamelist_review';
                    gamesSub = stored === 'myreview' ? 'myreview' : 'gamelist';
                } else if (stored === 'following' || stored === 'followers' || stored === 'follow') {
                    tab = 'follow';
                    followSub = stored === 'followers' ? 'followers' : 'following';
                } else if (stored === 'stats') {
                    tab = 'stats';
                }
            }
        }
        return { tab, gamesSub, followSub };
    };

    const initialState = getInitialState();
    const [activeTab, setActiveTab] = useState(initialState.tab);
    const [gamesSubTab, setGamesSubTab] = useState(initialState.gamesSub);
    const [followSubTab, setFollowSubTab] = useState(initialState.followSub);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let currentHash = activeTab;
            if (activeTab === 'gamelist_review') currentHash = gamesSubTab;
            else if (activeTab === 'follow') currentHash = followSubTab;

            localStorage.setItem('playscore_profile_tab', currentHash);
            if (window.location.hash !== `#${currentHash}`) {
                window.history.replaceState(null, '', `#${currentHash}`);
            }
        }
    }, [activeTab, gamesSubTab, followSubTab]);

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
        let mappedTab = tabKey;
        if (tabKey === 'gamelist' || tabKey === 'myreview') mappedTab = 'gamelist_review';
        if (tabKey === 'following' || tabKey === 'followers') mappedTab = 'follow';

        if (hasPendingChanges) {
            setPendingAction({ type: 'tab', value: mappedTab, rawTab: tabKey });
            setShowLeaveWarning(true);
        } else {
            setActiveTab(mappedTab);
            if (tabKey === 'gamelist' || tabKey === 'myreview') setGamesSubTab(tabKey);
            if (tabKey === 'following' || tabKey === 'followers') setFollowSubTab(tabKey);
        }
    };

    const isBackNavigationRef = useRef(false);

    const confirmLeaveWithoutSaving = () => {
        setShowLeaveWarning(false);
        setPendingChanges({});

        if (pendingAction?.type === 'tab') {
            setActiveTab(pendingAction.value);
            if (pendingAction.rawTab === 'gamelist' || pendingAction.rawTab === 'myreview') {
                setGamesSubTab(pendingAction.rawTab);
            }
            if (pendingAction.rawTab === 'following' || pendingAction.rawTab === 'followers') {
                setFollowSubTab(pendingAction.rawTab);
            }
        } else if (pendingAction?.type === 'url') {
            window.location.href = pendingAction.value;
        } else if (isBackNavigationRef.current) {
            isBackNavigationRef.current = false;
            window.history.back();
        }

        setPendingAction(null);
    };

    const cancelLeave = () => {
        setShowLeaveWarning(false);
        setPendingAction(null);
        isBackNavigationRef.current = false;
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

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasPendingChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handlePopState = (e) => {
            if (hasPendingChanges) {
                window.history.pushState(null, '', window.location.href);
                isBackNavigationRef.current = true;
                setPendingAction(null);
                setShowLeaveWarning(true);
            }
        };

        if (hasPendingChanges) {
            window.history.pushState({ unsaved: true }, '', window.location.href);
            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
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

                    {activeTab === 'gamelist_review' && (
                        <div>
                            <div className="flex border-b border-[#1F2923] mb-6 overflow-x-auto scrollbar-none">
                                <button
                                    onClick={() => setGamesSubTab('gamelist')}
                                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${gamesSubTab === 'gamelist'
                                        ? 'border-[#22C55E] text-[#22C55E]'
                                        : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                                        }`}
                                >
                                    Gamelist
                                </button>
                                <button
                                    onClick={() => setGamesSubTab('myreview')}
                                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${gamesSubTab === 'myreview'
                                        ? 'border-[#22C55E] text-[#22C55E]'
                                        : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                                        }`}
                                >
                                    My Review
                                </button>
                            </div>

                            {gamesSubTab === 'gamelist' ? (
                                <GameListTab gameList={gameList} />
                            ) : (
                                <MyReviewTab myReviews={myReviews} />
                            )}
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <StatsTab stats={stats} myReviews={myReviews} onSelectTab={handleTabChange} />
                    )}

                    {activeTab === 'follow' && (
                        <div>
                            <div className="flex border-b border-[#1F2923] mb-6 overflow-x-auto scrollbar-none">
                                <button
                                    onClick={() => setFollowSubTab('following')}
                                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${followSubTab === 'following'
                                        ? 'border-[#22C55E] text-[#22C55E]'
                                        : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                                        }`}
                                >
                                    Following ({followingCount})
                                </button>
                                <button
                                    onClick={() => setFollowSubTab('followers')}
                                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${followSubTab === 'followers'
                                        ? 'border-[#22C55E] text-[#22C55E]'
                                        : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                                        }`}
                                >
                                    Followers ({followersCount})
                                </button>
                            </div>

                            <FollowListTab user={authUser} type={followSubTab} />
                        </div>
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