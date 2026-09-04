import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { getAvatarUrl } from '@/Utils/avatar';

export default function NotificationsIndex({ notifications, unreadCount }) {
    const handleMarkAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const handleNotificationClick = (notif) => {
        if (!notif.read_at) {
            router.post(route('notifications.read', notif.id), {}, { preserveScroll: true });
        }

        if (notif.data.type === 'user_followed' || notif.data.follower_id) {
            router.get(route('users.show', notif.data.follower_id));
        } else if (notif.data.sender_id && notif.data.type === 'rank_congratulation') {
            router.get(route('users.show', notif.data.sender_id));
        } else if (notif.data.game_slug) {
            router.get(route('games.show', notif.data.game_slug));
        }
    };

    const handleUserClick = (e, userId) => {
        e.stopPropagation();
        if (userId) {
            router.get(route('users.show', userId));
        }
    };

    return (
        <AppLayout>
            <Head title="All Notifications" />

            <div className="max-w-[1216px] mx-auto w-full py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] tracking-tight">
                            Notifications
                        </h1>
                        <p className="text-xs sm:text-sm text-[#8B948F] mt-1">
                            All your past and recent activity updates across Playscore.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold hover:bg-[#22C55E]/20 transition shadow-sm self-start sm:self-auto"
                        >
                            <span>✓</span>
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>

                {/* Full Width Notification List Container */}
                <div className="bg-[#131916] border border-[#1F2923] rounded-2xl shadow-xl overflow-hidden">
                    {notifications.data.length === 0 ? (
                        <div className="py-20 text-center text-[#5A625D]">
                            <div className="w-14 h-14 rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-2xl mx-auto mb-3">
                                🔔
                            </div>
                            <p className="text-base font-semibold text-[#8B948F]">No notifications found.</p>
                            <p className="text-xs mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#1F2923]">
                            {notifications.data.map((notif) => {
                                const isCongratNotif = notif.data.type === 'rank_congratulation';
                                const isFollowNotif = notif.data.type === 'user_followed' || notif.data.follower_id;
                                const targetUserId = isCongratNotif ? notif.data.sender_id : (isFollowNotif ? notif.data.follower_id : notif.data.reviewer_id);
                                const rawName = isCongratNotif ? notif.data.sender_name : (isFollowNotif ? notif.data.follower_name : notif.data.reviewer_name);
                                const userName = rawName || 'A Gamer';
                                const userAvatar = isCongratNotif ? notif.data.sender_avatar : (isFollowNotif ? notif.data.follower_avatar : notif.data.reviewer_avatar);

                                const isUnread = !notif.read_at;

                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 sm:p-6 transition flex items-center justify-between gap-4 cursor-pointer ${
                                            isUnread
                                                ? 'bg-[#142119] border-l-4 border-l-[#22C55E] hover:bg-[#192A20]'
                                                : 'bg-[#131916] hover:bg-[#19221C]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Avatar */}
                                            <button
                                                type="button"
                                                onClick={(e) => handleUserClick(e, targetUserId)}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-xs sm:text-sm font-bold overflow-hidden shrink-0 hover:ring-2 hover:ring-[#22C55E] transition"
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

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#F5F7F5] text-xs sm:text-sm leading-relaxed">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleUserClick(e, targetUserId)}
                                                        className="font-semibold hover:text-[#22C55E] hover:underline transition"
                                                    >
                                                        {userName}
                                                    </button>{' '}
                                                    {isCongratNotif ? (
                                                        <>
                                                            congratulated you on reaching <span className="font-bold text-[#22C55E]">{notif.data.rank_name}</span>: "{notif.data.message}"
                                                        </>
                                                    ) : isFollowNotif ? (
                                                        'started following you.'
                                                    ) : (
                                                        <>
                                                            also reviewed <span className="font-semibold">{notif.data.game_title || 'a game'}</span>.
                                                        </>
                                                    )}
                                                </p>
                                                <p className="text-[#5A625D] text-[11px] sm:text-xs mt-1 font-medium">
                                                    {notif.created_at}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Clear Read / Unread Status Badge */}
                                        <div className="shrink-0 ml-2">
                                            {isUnread ? (
                                                <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-bold shadow-sm">
                                                    Unread
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-[#0B0F0D] border border-[#1F2923] text-[#5A625D] text-xs font-medium">
                                                    Read
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination Footer - Max 10 items per page */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#1F2923]">
                        <p className="text-xs text-[#8B948F]">
                            Showing <span className="font-semibold text-[#F5F7F5]">{notifications.from || 0}</span> to{' '}
                            <span className="font-semibold text-[#F5F7F5]">{notifications.to || 0}</span> of{' '}
                            <span className="font-semibold text-[#F5F7F5]">{notifications.total}</span> notifications
                        </p>
                        <div className="flex items-center gap-1.5">
                        {notifications.links.map((link, i) => {
                                // Decode HTML entities dari Laravel paginator (« » &amp; dst.)
                                // tanpa pakai dangerouslySetInnerHTML
                                const decodeLabel = (str) => {
                                    const el = document.createElement('textarea');
                                    el.innerHTML = str;
                                    return el.value;
                                };
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-[#22C55E] text-[#0B0F0D]'
                                                : link.url
                                                ? 'bg-[#131916] text-[#8B948F] border border-[#1F2923] hover:text-[#F5F7F5] hover:border-[#2E3A32]'
                                                : 'text-[#5A625D] cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        {decodeLabel(link.label)}
                                    </Link>
                                );
                            })}

                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
