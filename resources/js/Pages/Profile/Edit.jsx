import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ProfileTab from './Partials/ProfileTab';
import InterestTab from './Partials/InterestTab';
import GameListTab from './Partials/GameListTab';
import StatsTab from './Partials/StatsTab';

const TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'interest', label: 'Interest' },
    { key: 'gamelist', label: 'Gamelist' },
    { key: 'stats', label: 'Stats' },
];

export default function Edit({
    mustVerifyEmail,
    status,
    allInterests,
    userInterestIds,
    recommendations,
    gameList,
    stats,
}) {
    const [activeTab, setActiveTab] = useState('profile');

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

            <div className="flex gap-8">
                <aside className="w-56 shrink-0">
                    <nav className="space-y-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.key
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:bg-[#131916] hover:text-[#F5F7F5]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">
                    {activeTab === 'profile' && (
                        <ProfileTab mustVerifyEmail={mustVerifyEmail} status={status} />
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
                    {activeTab === 'stats' && <StatsTab stats={stats} />}
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