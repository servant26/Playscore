import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/Utils/avatar';
import RankUpModal from '@/Components/RankUpModal';

export default function AppLayout({ children }) {
    const { auth, url, flash } = usePage().props;
    const currentUrl = usePage().url;
    const [search, setSearch] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [rankUpData, setRankUpData] = useState(null);

    useEffect(() => {
        if (flash?.rank_up) {
            setRankUpData(flash.rank_up);
        }
    }, [flash?.rank_up]);

    const isHomeOrSearch = currentUrl.startsWith('/dashboard') || currentUrl.startsWith('/search') || currentUrl.startsWith('/all-games');

    const submitSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.get(route('search'), { q: search });
        } else {
            router.get(route('dashboard'));
        }
    };

    const fetchNotifications = () => {
        setLoadingNotifs(true);
        fetch(route('notifications.unread'))
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            })
            .catch(() => {})
            .finally(() => setLoadingNotifs(false));
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleNotifMenu = () => {
        setShowProfileMenu(false);
        setShowNotifMenu(!showNotifMenu);
        if (!showNotifMenu) {
            fetchNotifications();
        }
    };

    const handleMarkAllAsRead = (e) => {
        e.stopPropagation();
        setUnreadCount(0);
        setNotifications([]);

        fetch(route('notifications.read-all'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        }).catch(() => {});
    };

    const handleNotificationClick = (notif) => {
        setShowNotifMenu(false);

        if (!notif.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setNotifications((prev) => prev.filter((n) => n.id !== notif.id));

            fetch(route('notifications.read', notif.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            }).catch(() => {});
        }

        if (notif.data.type === 'user_followed' || notif.data.follower_id) {
            router.get(route('users.show', notif.data.follower_id));
        } else if (notif.data.sender_id && notif.data.type === 'rank_congratulation') {
            router.get(route('users.show', notif.data.sender_id));
        } else if (notif.data.game_slug) {
            router.get(route('games.show', notif.data.game_slug));
        }
    };

    const handleUserClick = (e, userId, notif = null) => {
        e.stopPropagation();
        setShowNotifMenu(false);

        if (notif && !notif.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setNotifications((prev) => prev.filter((n) => n.id !== notif.id));

            fetch(route('notifications.read', notif.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            }).catch(() => {});
        }

        if (userId) {
            router.get(route('users.show', userId));
        }
    };

    const initials = auth.user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen bg-[#0B0F0D] w-full overflow-x-hidden">
            <nav className="sticky top-0 z-40 bg-[#0F1512] border-b border-[#1F2923]">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center gap-6">
                    <Link href={auth?.user?.role === 'admin' ? route('admin.dashboard') : route('dashboard')} className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                            <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                        </div>
                        <span className="text-[#F5F7F5] font-semibold text-lg hidden sm:block">
                            Playscore
                        </span>
                    </Link>

                    {isHomeOrSearch && auth?.user?.role !== 'admin' && (
                        <form onSubmit={submitSearch} className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games or users..."
                                className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            />
                        </form>
                    )}

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="relative">
                            <button
                                onClick={toggleNotifMenu}
                                className="relative text-[#8B948F] hover:text-[#F5F7F5] transition flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span
                                        style={{ backgroundColor: '#DC2626' }}
                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-semibold flex items-center justify-center"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifMenu && (
                                <div className="absolute -right-14 sm:right-0 top-10 w-[calc(100vw-3rem)] sm:w-80 max-w-sm bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[#1F2923] flex items-center justify-between">
                                        <p className="text-[#F5F7F5] text-sm font-medium">New Notifications</p>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleMarkAllAsRead}
                                                className="text-[11px] text-[#22C55E] hover:underline font-medium"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {loadingNotifs ? (
                                            <p className="text-[#5A625D] text-sm text-center py-6">Loading...</p>
                                        ) : notifications.length === 0 ? (
                                            <div className="py-8 text-center px-4">
                                                <p className="text-[#8B948F] text-xs font-medium">No unread notifications.</p>
                                                <p className="text-[#5A625D] text-[11px] mt-1">Check full history in View All.</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => {
                                                const isCongratNotif = notif.data.type === 'rank_congratulation';
                                                const isFollowNotif = notif.data.type === 'user_followed' || notif.data.follower_id;
                                                const targetUserId = isCongratNotif ? notif.data.sender_id : (isFollowNotif ? notif.data.follower_id : notif.data.reviewer_id);
                                                const rawName = isCongratNotif ? notif.data.sender_name : (isFollowNotif ? notif.data.follower_name : notif.data.reviewer_name);
                                                const userName = rawName || 'A Gamer';
                                                const userAvatar = isCongratNotif ? notif.data.sender_avatar : (isFollowNotif ? notif.data.follower_avatar : notif.data.reviewer_avatar);

                                                return (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className="w-full text-left px-4 py-3 border-b border-[#1F2923] last:border-0 hover:bg-[#19221C] transition flex items-start gap-3 cursor-pointer bg-[#0B120E]"
                                                    >
                                                        <button
                                                            onClick={(e) => handleUserClick(e, targetUserId, notif)}
                                                            className="w-9 h-9 aspect-square rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-xs font-semibold overflow-hidden shrink-0 hover:ring-2 hover:ring-[#22C55E] transition"
                                                            style={{ minWidth: '36px', minHeight: '36px' }}
                                                            title="View Profile"
                                                        >
                                                            {userAvatar ? (
                                                                <img
                                                                    src={getAvatarUrl(userAvatar)}
                                                                    alt={userName}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <span style={{ display: userAvatar ? 'none' : 'block' }}>
                                                                {userName.slice(0, 2).toUpperCase()}
                                                            </span>
                                                        </button>
                                                        <div className="flex-1 min-w-0 pr-2">
                                                            <p className="text-[#F5F7F5] text-xs leading-relaxed">
                                                                <button
                                                                    onClick={(e) => handleUserClick(e, targetUserId, notif)}
                                                                    className="font-medium hover:text-[#22C55E] hover:underline transition"
                                                                    title="View Profile"
                                                                >
                                                                    {userName}
                                                                </button>{' '}
                                                                {isCongratNotif ? (
                                                                    <>
                                                                        congratulated you on reaching <span className="font-semibold text-[#22C55E]">{notif.data.rank_name}</span>: "{notif.data.message}"
                                                                    </>
                                                                ) : isFollowNotif ? (
                                                                    'started following you.'
                                                                ) : (
                                                                    <>
                                                                        also reviewed{' '}
                                                                        <span className="font-medium">{notif.data.game_title || 'a game'}</span>.
                                                                    </>
                                                                )}
                                                            </p>
                                                            <p className="text-[#5A625D] text-[11px] mt-1">
                                                                {notif.created_at}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="px-4 py-3 bg-[#0B0F0D] border-t border-[#1F2923] text-center">
                                        <Link
                                            href={route('notifications.index')}
                                            onClick={() => setShowNotifMenu(false)}
                                            className="text-xs text-[#22C55E] hover:underline font-bold inline-flex items-center gap-1"
                                        >
                                            <span>View All Notifications</span>
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setShowNotifMenu(false);
                                    setShowProfileMenu(!showProfileMenu);
                                }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#131916] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm font-semibold overflow-hidden">
                                    {auth.user.avatar ? (
                                        <img
                                            src={getAvatarUrl(auth.user.avatar)}
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'block';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <span style={{ display: auth.user.avatar ? 'none' : 'block' }}>
                                        {initials}
                                    </span>
                                </div>
                                <span className="text-[#F5F7F5] text-sm font-medium hidden sm:block">
                                    {auth.user.name}
                                </span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 top-12 w-48 bg-[#131916] border border-[#1F2923] rounded-lg shadow-lg py-1 z-50">
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-4 py-2 text-sm text-[#F5F7F5] hover:bg-[#1F2923]"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 text-sm text-[#F5F7F5] hover:bg-[#1F2923]"
                                    >
                                        Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-5">{children}</main>

            {/* Rank Up Celebration Modal */}
            <RankUpModal
                show={!!rankUpData}
                rankUpData={rankUpData}
                onClose={() => setRankUpData(null)}
            />
        </div>
    );
}