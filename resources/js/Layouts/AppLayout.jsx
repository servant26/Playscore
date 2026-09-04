import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { getAvatarUrl } from '@/Utils/avatar';
import RankUpModal from '@/Components/RankUpModal';
import StoryViewerModal from '@/Components/StoryViewerModal';
import Modal from '@/Components/Modal';

export default function AppLayout({ children }) {
    const { auth, url, flash } = usePage().props;
    const currentUrl = usePage().url;
    const [currentHash, setCurrentHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
    const [search, setSearch] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [showMyDataMenu, setShowMyDataMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [rankUpData, setRankUpData] = useState(null);
    const [showStoriesDrawer, setShowStoriesDrawer] = useState(false);
    const [storiesFeed, setStoriesFeed] = useState({ my_stories: [], following_story_groups: [] });
    const [loadingStoriesFeed, setLoadingStoriesFeed] = useState(false);
    const [storyViewer, setStoryViewer] = useState({ show: false, stories: [], index: 0 });
    const [showEmptyStoryModal, setShowEmptyStoryModal] = useState(false);
    const [viewedStoryIds, setViewedStoryIds] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('playscore_viewed_stories');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const handleStoryViewed = (storyId) => {
        setViewedStoryIds((prev) => {
            if (prev.includes(storyId)) return prev;
            const updated = [...prev, storyId];
            try {
                localStorage.setItem('playscore_viewed_stories', JSON.stringify(updated));
            } catch {}
            return updated;
        });
    };

    const fetchStoriesFeed = () => {
        setLoadingStoriesFeed(true);
        fetch(route('stories.feed'))
            .then((res) => res.json())
            .then((data) => {
                setStoriesFeed({
                    my_stories: data.my_stories || [],
                    following_story_groups: data.following_story_groups || [],
                });
            })
            .catch(() => {})
            .finally(() => setLoadingStoriesFeed(false));
    };

    const storiesCloseTimeoutRef = useRef(null);

    const openStoriesDrawer = () => {
        if (storiesCloseTimeoutRef.current) {
            clearTimeout(storiesCloseTimeoutRef.current);
            storiesCloseTimeoutRef.current = null;
        }
        setShowStoriesDrawer(true);
        fetchStoriesFeed();
    };

    const handleStoriesMouseLeave = () => {
        if (storiesCloseTimeoutRef.current) {
            clearTimeout(storiesCloseTimeoutRef.current);
        }
        storiesCloseTimeoutRef.current = setTimeout(() => {
            setShowStoriesDrawer(false);
        }, 250);
    };

    const handleStoriesMouseEnter = () => {
        if (storiesCloseTimeoutRef.current) {
            clearTimeout(storiesCloseTimeoutRef.current);
            storiesCloseTimeoutRef.current = null;
        }
    };

    const toggleStoriesDrawer = () => {
        const nextState = !showStoriesDrawer;
        setShowStoriesDrawer(nextState);
        if (nextState) {
            fetchStoriesFeed();
        }
    };

    useEffect(() => {
        const updateHash = () => {
            setCurrentHash(window.location.hash || '');
        };
        window.addEventListener('hashchange', updateHash);
        window.addEventListener('popstate', updateHash);
        return () => {
            window.removeEventListener('hashchange', updateHash);
            window.removeEventListener('popstate', updateHash);
        };
    }, []);

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

        // Check unread notifications every 90 seconds, only when user tab is active (saves server bandwidth)
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        }, 90000);

        // Also fetch immediately when user switches back to this tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
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

    const navItems = [
        {
            key: 'stories',
            label: 'Stories',
            onClick: toggleStoriesDrawer,
            isActive: showStoriesDrawer,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            key: 'dashboard',
            label: 'Dashboard',
            href: route('dashboard'),
            isActive: currentUrl === '/dashboard' || currentUrl.startsWith('/dashboard?') || currentUrl.startsWith('/all-games'),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            key: 'myreview',
            label: 'My Review',
            href: route('profile.edit') + '#myreview',
            isActive: currentUrl.includes('/profile') && (typeof window !== 'undefined' && window.location.hash.includes('myreview')),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
        {
            key: 'mylist',
            label: 'My List',
            href: route('profile.edit') + '#gamelist',
            isActive: currentUrl.includes('/profile') && (typeof window !== 'undefined' && window.location.hash.includes('gamelist')),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            ),
        },
        {
            key: 'stats',
            label: 'Stats',
            href: route('profile.edit') + '#stats',
            isActive: currentUrl.includes('/profile') && (typeof window !== 'undefined' && window.location.hash.includes('stats')),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            key: 'mutual',
            label: 'Mutual',
            href: route('profile.edit') + '#following',
            isActive: currentUrl.includes('/profile') && (typeof window !== 'undefined' && (window.location.hash.includes('follow') || window.location.hash.includes('mutual'))),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F0D] w-full relative">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-40 bg-[#0F1512]/95 backdrop-blur-md border-b border-[#1F2923]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center gap-4 sm:gap-6">
                    <Link href={auth?.user?.role === 'admin' ? route('admin.dashboard') : route('dashboard')} className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.35)]">
                            <span className="text-[#0B0F0D] font-black text-sm">P</span>
                        </div>
                        <span className="text-[#F5F7F5] font-semibold text-lg hidden sm:block">
                            Playscore
                        </span>
                    </Link>

                    {auth?.user?.role !== 'admin' && (
                        <form onSubmit={submitSearch} className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games or users..."
                                className="w-full rounded-xl bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
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
                                        href={route('profile.edit') + '#profile'}
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

            {/* Layout Body: Left HRIS-Style Pill Sidebar + Main Content */}
            <div className="max-w-[1440px] mx-auto flex items-start px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-5 gap-3 sm:gap-6">
                {/* Floating Rounded Pill Sidebar - ONLY for Regular Users (Hidden for Admin) */}
                {auth?.user?.role !== 'admin' && (
                    <aside className="fixed left-3 sm:left-4 lg:left-5 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center bg-[#131916]/95 backdrop-blur-xl border border-[#1F2923] rounded-full py-4 px-2 shadow-2xl space-y-3">
                        {navItems.map((item) => {
                            const btnClass = `relative group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                                item.isActive
                                    ? 'bg-[#22C55E] text-[#0B0F0D] shadow-[0_0_16px_rgba(34,197,94,0.4)]'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                            }`;

                            if (item.onClick) {
                                const isStories = item.key === 'stories';
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={item.onClick}
                                        onMouseEnter={isStories ? openStoriesDrawer : undefined}
                                        onMouseLeave={isStories ? handleStoriesMouseLeave : undefined}
                                        className={btnClass}
                                        title={item.label}
                                    >
                                        {item.icon}
                                        {/* Tooltip on Hover (hidden for stories if drawer is open) */}
                                        <span className={`absolute left-14 bg-[#0F1512] border border-[#1F2923] text-[#F5F7F5] text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none ${
                                            isStories && showStoriesDrawer ? 'hidden' : 'group-hover:opacity-100'
                                        } transition-opacity duration-200 whitespace-nowrap z-50`}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={btnClass}
                                    title={item.label}
                                >
                                    {item.icon}
                                    {/* Tooltip on Hover */}
                                    <span className="absolute left-14 bg-[#0F1512] border border-[#1F2923] text-[#F5F7F5] text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </aside>
                )}

                {/* Main Content Area (No left offset for admin, normal offset for regular users) */}
                <main className={`flex-1 min-w-0 w-full ${auth?.user?.role === 'admin' ? 'pb-0' : 'pb-20 md:pb-0 md:pl-16 md:pr-4 lg:pl-18 lg:pr-0'}`}>
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar: Stories, My Data (Popup: My List, My Review), Dashboard, Stats, Mutual (ONLY for regular users) */}
            {auth?.user?.role !== 'admin' && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F1512]/95 backdrop-blur-md border-t border-[#1F2923] py-2 grid grid-cols-5 items-center">
                    {/* 1. Stories */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowMyDataMenu(false);
                            toggleStoriesDrawer();
                        }}
                        className={`flex flex-col items-center justify-center gap-1 py-1 w-full transition ${
                            showStoriesDrawer
                                ? 'text-[#22C55E] font-bold'
                                : 'text-[#8B948F] hover:text-[#F5F7F5]'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[10px] font-medium whitespace-nowrap">Stories</span>
                    </button>

                    {/* 2. My Data (Custom Popup Menu for My List & My Review) */}
                    <div className="relative flex flex-col items-center justify-center">
                        <button
                            type="button"
                            onClick={() => setShowMyDataMenu(!showMyDataMenu)}
                            className={`flex flex-col items-center justify-center gap-1 py-1 w-full transition cursor-pointer ${
                                currentUrl.includes('/profile') &&
                                (currentHash.includes('gamelist') || currentHash.includes('myreview'))
                                    ? 'text-[#22C55E] font-bold'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-[10px] font-medium whitespace-nowrap">My Data</span>
                        </button>

                        {/* Floating Popup for My List & My Review */}
                        {showMyDataMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                                    onClick={() => setShowMyDataMenu(false)}
                                />
                                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 bg-[#131916] border border-[#1F2923] rounded-2xl p-2 shadow-2xl min-w-[140px] flex flex-col gap-1">
                                    <Link
                                        href={route('profile.edit') + '#gamelist'}
                                        onClick={() => setShowMyDataMenu(false)}
                                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition ${
                                            currentUrl.includes('/profile') && currentHash.includes('gamelist')
                                                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                : 'text-[#F5F7F5] hover:bg-[#1F2923] hover:text-[#22C55E]'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 text-[#22C55E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        <span>My List</span>
                                    </Link>
                                    <Link
                                        href={route('profile.edit') + '#myreview'}
                                        onClick={() => setShowMyDataMenu(false)}
                                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition ${
                                            currentUrl.includes('/profile') && currentHash.includes('myreview')
                                                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                : 'text-[#F5F7F5] hover:bg-[#1F2923] hover:text-[#22C55E]'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 text-[#22C55E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>My Review</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 3. Dashboard (Exact Middle - Slot 3 of 5) */}
                    <Link
                        href={route('dashboard')}
                        onClick={() => setShowMyDataMenu(false)}
                        className={`flex flex-col items-center justify-center gap-1 py-1 w-full transition ${
                            currentUrl === '/dashboard' || currentUrl.startsWith('/dashboard?') || currentUrl.startsWith('/all-games')
                                ? 'text-[#22C55E] font-bold'
                                : 'text-[#8B948F] hover:text-[#F5F7F5]'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="text-[10px] font-medium whitespace-nowrap">Dashboard</span>
                    </Link>

                    {/* 4. Stats */}
                    <Link
                        href={route('profile.edit') + '#stats'}
                        onClick={() => setShowMyDataMenu(false)}
                        className={`flex flex-col items-center justify-center gap-1 py-1 w-full transition ${
                            currentUrl.includes('/profile') && currentHash.includes('stats')
                                ? 'text-[#22C55E] font-bold'
                                : 'text-[#8B948F] hover:text-[#F5F7F5]'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-[10px] font-medium whitespace-nowrap">Stats</span>
                    </Link>

                    {/* 5. Mutual */}
                    <Link
                        href={route('profile.edit') + '#following'}
                        onClick={() => setShowMyDataMenu(false)}
                        className={`flex flex-col items-center justify-center gap-1 py-1 w-full transition ${
                            currentUrl.includes('/profile') &&
                            (currentHash.includes('follow') || currentHash.includes('mutual'))
                                ? 'text-[#22C55E] font-bold'
                                : 'text-[#8B948F] hover:text-[#F5F7F5]'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-[10px] font-medium whitespace-nowrap">Mutual</span>
                    </Link>
                </div>
            )}

            {/* Slide-out Stories Drawer (Sliding from left on desktop, from bottom/side on mobile) */}
            {/* Backdrop (Mobile Only) */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
                    showStoriesDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setShowStoriesDrawer(false)}
            />

            {/* Drawer Content */}
            <div
                onMouseEnter={handleStoriesMouseEnter}
                onMouseLeave={handleStoriesMouseLeave}
                className={`fixed z-50 top-0 left-0 bottom-0 w-full sm:w-96 md:left-20 lg:left-24 md:top-6 md:bottom-6 md:h-auto md:max-h-[calc(100vh-48px)] md:rounded-3xl bg-[#0F1512] border border-[#1F2923] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
                    showStoriesDrawer
                        ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                        : 'opacity-0 -translate-x-8 scale-95 pointer-events-none'
                }`}
            >
                        {/* Drawer Header */}
                        <div className="px-5 py-4 border-b border-[#1F2923] flex items-center justify-between bg-[#131916]">
                            <div>
                                <h3 className="text-base font-bold text-[#F5F7F5]">Stories</h3>
                                <p className="text-[11px] text-[#8B948F]">Recent 24h updates from friends</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowStoriesDrawer(false)}
                                className="w-8 h-8 rounded-full hover:bg-[#1F2923] text-[#8B948F] hover:text-[#F5F7F5] flex items-center justify-center transition text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Stories Feed Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                            {/* 1. My Story Section */}
                            <div>
                                <div className="text-[11px] font-bold text-[#8B948F] uppercase tracking-wider mb-2.5 px-1">
                                    My Story
                                </div>
                                {(() => {
                                    const hasMine = storiesFeed.my_stories && storiesFeed.my_stories.length > 0;
                                    const mineUnviewed = hasMine && storiesFeed.my_stories.some((s) => !viewedStoryIds.includes(s.id));

                                    return (
                                        <div
                                            onClick={() => {
                                                if (hasMine) {
                                                    setStoryViewer({ show: true, stories: storiesFeed.my_stories, index: 0 });
                                                } else {
                                                    setShowEmptyStoryModal(true);
                                                }
                                            }}
                                            className="group cursor-pointer bg-[#131916] border border-[#1F2923] hover:border-white/30 rounded-2xl p-3 flex items-center justify-between transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`relative w-12 h-12 rounded-full shrink-0 ${
                                                    !hasMine
                                                        ? 'border-2 border-dashed border-[#1F2923]'
                                                        : mineUnviewed
                                                        ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC]'
                                                        : 'border-2 border-[#1F2923]'
                                                }`}>
                                                    <div className="w-full h-full rounded-full bg-[#0B0F0D] flex items-center justify-center overflow-hidden">
                                                        {auth.user.avatar ? (
                                                            <img
                                                                src={getAvatarUrl(auth.user.avatar)}
                                                                alt={auth.user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[#F5F7F5] font-bold text-xs">
                                                                {initials}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {hasMine ? (
                                                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#22C55E] text-[#0B0F0D] text-[9px] font-extrabold border-2 border-[#0F1512]">
                                                            {storiesFeed.my_stories.length}
                                                        </span>
                                                    ) : (
                                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1F2923] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0F1512]">
                                                            +
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-semibold text-[#F5F7F5] group-hover:text-white truncate">
                                                        Your Story
                                                    </h4>
                                                    <p className="text-xs text-[#8B948F] truncate">
                                                        {hasMine
                                                            ? `${storiesFeed.my_stories.length} active story update${storiesFeed.my_stories.length > 1 ? 's' : ''}`
                                                            : 'Post review to share a story'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-xs text-[#8B948F] group-hover:text-[#22C55E] font-medium shrink-0 ml-2">
                                                {hasMine ? 'View ›' : 'Add +'}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* 2. Friends' Stories */}
                            <div>
                                <div className="text-[11px] font-bold text-[#8B948F] uppercase tracking-wider mb-2.5 px-1 flex items-center justify-between">
                                    <span>Following ({storiesFeed.following_story_groups.length})</span>
                                    {loadingStoriesFeed && (
                                        <span className="text-[10px] text-white font-normal animate-pulse">Loading...</span>
                                    )}
                                </div>

                                {storiesFeed.following_story_groups.length === 0 ? (
                                    <div className="bg-[#131916] border border-[#1F2923] rounded-2xl p-6 text-center">
                                        <p className="text-xs text-[#F5F7F5] font-semibold mb-1">
                                            No Recent Stories
                                        </p>
                                        <p className="text-[11px] text-[#8B948F] leading-relaxed">
                                            Follow more gamers in the community to see their daily review stories here!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {storiesFeed.following_story_groups.map((group) => {
                                            const groupHasUnviewed = group.stories.some((s) => !viewedStoryIds.includes(s.id));
                                            const userInitials = group.user_name
                                                .split(' ')
                                                .map((w) => w[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase();
                                            const latestStory = group.stories[group.stories.length - 1];

                                            // Hitung komposisi stories
                                            const reviewStories = group.stories.filter((s) => s.type !== 'rank_up' && s.review?.game_title);
                                            const rankStories = group.stories.filter((s) => s.type === 'rank_up');
                                            const totalStories = group.stories.length;

                                            let storySummaryText = '';
                                            let hasMultipleStories = totalStories > 1;

                                            if (totalStories === 1) {
                                                if (rankStories.length > 0) {
                                                    storySummaryText = `Promoted to ${rankStories[0].rank_name} 🎉`;
                                                } else if (reviewStories.length > 0) {
                                                    storySummaryText = `Reviewed ${reviewStories[0].review.game_title}`;
                                                } else {
                                                    storySummaryText = 'Shared a new story';
                                                }
                                            } else {
                                                // Lebih dari 1 story
                                                if (reviewStories.length > 0 && rankStories.length > 0) {
                                                    const gameText = reviewStories.length === 1 ? '1 game' : `${reviewStories.length} games`;
                                                    storySummaryText = `Reviewed ${gameText} and ranked up`;
                                                } else if (rankStories.length > 0) {
                                                    storySummaryText = `Promoted to ${rankStories[rankStories.length - 1].rank_name}`;
                                                } else if (reviewStories.length > 0) {
                                                    storySummaryText = `Reviewed ${reviewStories.length} games`;
                                                } else {
                                                    storySummaryText = `${totalStories} new stories`;
                                                }
                                            }

                                            return (
                                                <div
                                                    key={group.user_id}
                                                    onClick={() => {
                                                        setStoryViewer({ show: true, stories: group.stories, index: 0 });
                                                    }}
                                                    className="group cursor-pointer bg-[#131916] border border-[#1F2923] hover:border-white/30 rounded-2xl p-3 flex items-center justify-between transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                                        <div className={`relative w-12 h-12 rounded-full shrink-0 ${
                                                            groupHasUnviewed
                                                                ? 'p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC]'
                                                                : 'border-2 border-[#1F2923]'
                                                        }`}>
                                                            <div className="w-full h-full rounded-full bg-[#0B0F0D] flex items-center justify-center overflow-hidden">
                                                                {group.user_avatar ? (
                                                                    <img
                                                                        src={getAvatarUrl(group.user_avatar)}
                                                                        alt={group.user_name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-[#F5F7F5] font-bold text-xs">
                                                                        {userInitials}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold border-2 border-[#0F1512] ${
                                                                groupHasUnviewed ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                                            }`}>
                                                                {group.stories.length}
                                                            </span>
                                                        </div>

                                                        <div className="min-w-0 flex-1 pr-1">
                                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                                <h4 className="text-sm font-semibold text-[#F5F7F5] group-hover:text-white truncate">
                                                                    {group.user_name}
                                                                </h4>
                                                                <span className={`text-[11px] font-medium shrink-0 ${
                                                                    groupHasUnviewed ? 'text-[#22C55E]' : 'text-[#8B948F]'
                                                                }`}>
                                                                    {latestStory?.created_at || 'View'}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#8B948F] leading-relaxed break-words">
                                                                {storySummaryText}
                                                            </p>
                                                            {hasMultipleStories && (
                                                                <p className="text-[11px] text-[#5A625D] group-hover:text-[#22C55E] transition-colors mt-0.5">
                                                                    Click to view more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

            {/* Global Story Viewer Modal triggered from drawer */}
            {storyViewer.show && (
                <StoryViewerModal
                    show={storyViewer.show}
                    stories={storyViewer.stories}
                    initialIndex={storyViewer.index}
                    onClose={() => setStoryViewer({ show: false, stories: [], index: 0 })}
                    onStoryViewed={handleStoryViewed}
                />
            )}

            {/* Story Guide Modal (Exact original version) */}
            <Modal show={showEmptyStoryModal} onClose={() => setShowEmptyStoryModal(false)} maxWidth="lg">
                <div className="bg-[#131916] border border-[#1F2923] p-8 sm:p-10 rounded-2xl shadow-2xl text-center relative">
                    <button
                        onClick={() => setShowEmptyStoryModal(false)}
                        className="absolute top-4 right-4 text-[#8B948F] hover:text-[#F5F7F5] transition text-sm cursor-pointer"
                    >
                        ✕
                    </button>

                    <h3 className="text-[#F5F7F5] font-bold text-xl sm:text-2xl mb-3">
                        How to Create Your Story
                    </h3>

                    <p className="text-[#8B948F] text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                        Stories are generated automatically! To publish a story, you need to <span className="text-[#22C55E] font-semibold">write a game review</span> or <span className="text-[#22C55E] font-semibold">rank up your profile</span> by engaging with the community.
                    </p>

                    <div className="pt-2 max-w-xs mx-auto">
                        <button
                            type="button"
                            onClick={() => setShowEmptyStoryModal(false)}
                            className="w-full py-3 px-6 rounded-xl bg-[#22C55E] text-[#0B0F0D] text-sm font-bold hover:bg-[#16A34A] transition shadow-lg tracking-wide cursor-pointer"
                        >
                            Got It, Let's Game!
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Rank Up Celebration Modal */}
            <RankUpModal
                show={!!rankUpData}
                rankUpData={rankUpData}
                onClose={() => setRankUpData(null)}
            />
        </div>
    );
}