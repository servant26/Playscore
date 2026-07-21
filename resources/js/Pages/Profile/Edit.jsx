import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
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

    return (
        <AppLayout>
            <Head title="Profile" />

            <div className="flex gap-8">
                <aside className="w-56 shrink-0">
                    <nav className="space-y-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
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
                            myListIds={gameList.map((g) => g.id)}
                        />
                    )}
                    {activeTab === 'gamelist' && <GameListTab gameList={gameList} />}
                    {activeTab === 'stats' && <StatsTab stats={stats} />}
                </div>
            </div>
        </AppLayout>
    );
}