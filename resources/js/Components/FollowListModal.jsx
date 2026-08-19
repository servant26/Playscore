import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function FollowListModal({ show, type = 'followers', user, onClose }) {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [userToUnfollow, setUserToUnfollow] = useState(null);

    useEffect(() => {
        if (show && user?.id) {
            setLoading(true);
            setSearch('');
            const endpoint = type === 'followers' 
                ? route('users.followers', user.id) 
                : route('users.following', user.id);

            fetch(endpoint)
                .then((res) => res.json())
                .then((data) => {
                    setUsersList(data.users || []);
                })
                .catch(() => setUsersList([]))
                .finally(() => setLoading(false));
        }
    }, [show, type, user]);

    if (!show) return null;

    const filteredUsers = usersList.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleUserClick = (userId) => {
        onClose();
        router.get(route('users.show', userId));
    };

    const handleToggleFollowClick = (u) => {
        if (u.is_following) {
            // Show unfollow confirmation modal in English
            setUserToUnfollow(u);
        } else {
            // Instantly follow
            setUsersList((prev) =>
                prev.map((item) => (item.id === u.id ? { ...item, is_following: true } : item))
            );
            router.post(
                route('users.follow', u.id),
                {},
                { preserveScroll: true, preserveState: true }
            );
        }
    };

    const confirmUnfollow = () => {
        if (!userToUnfollow) return;
        const targetId = userToUnfollow.id;

        setUsersList((prev) =>
            prev.map((item) => (item.id === targetId ? { ...item, is_following: false } : item))
        );

        router.post(
            route('users.follow', targetId),
            {},
            { preserveScroll: true, preserveState: true }
        );

        setUserToUnfollow(null);
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-[#131916] border border-[#1F2923] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#1F2923] flex items-center justify-between">
                    <div>
                        <h3 className="text-[#F5F7F5] text-base font-semibold capitalize">
                            {type}
                        </h3>
                        <p className="text-[#8B948F] text-xs mt-0.5">
                            {user?.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#8B948F] hover:text-[#F5F7F5] p-1 rounded-lg transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Search Bar */}
                {usersList.length > 5 && (
                    <div className="px-5 py-3 border-b border-[#1F2923]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${type}...`}
                            className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                        />
                    </div>
                )}

                {/* Body List */}
                <div className="p-4 overflow-y-auto flex-1 space-y-2.5 custom-scrollbar">
                    {loading ? (
                        <div className="py-12 text-center text-[#5A625D] text-xs">Loading...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-12 text-center text-[#8B948F] text-xs">
                            {usersList.length === 0
                                ? `No ${type} yet.`
                                : `No users matching "${search}".`}
                        </div>
                    ) : (
                        filteredUsers.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between gap-3 bg-[#0B0F0D] border border-[#1F2923] hover:border-[#2E3A32] p-3 rounded-xl transition"
                            >
                                <div
                                    onClick={() => handleUserClick(u.id)}
                                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#131916] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-xs font-semibold overflow-hidden shrink-0 group-hover:border-[#22C55E] transition">
                                        {u.avatar ? (
                                            <img
                                                src={`/storage/${u.avatar}`}
                                                alt={u.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            u.name.slice(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-[#F5F7F5] text-xs font-medium truncate group-hover:text-[#22C55E] transition">
                                            {u.name}
                                        </h4>
                                        <p className="text-[#5A625D] text-[11px] mt-0.5">
                                            {u.reviews_count} {u.reviews_count === 1 ? 'review' : 'reviews'}
                                        </p>
                                    </div>
                                </div>

                                {!u.is_self && (
                                    <button
                                        onClick={() => handleToggleFollowClick(u)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                            u.is_following
                                                ? 'bg-[#1F2923] text-[#8B948F] hover:bg-[#2E3A32] hover:text-[#DC2626]'
                                                : 'bg-[#22C55E] text-[#0B0F0D] hover:bg-[#16A34A]'
                                        }`}
                                    >
                                        {u.is_following ? 'Following' : '+ Follow'}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Unfollow Confirmation Modal in English */}
            {userToUnfollow && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] px-4"
                    onClick={() => setUserToUnfollow(null)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 max-w-sm w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[#F5F7F5] text-base font-semibold mb-2">
                            Unfollow {userToUnfollow.name}?
                        </h3>
                        <p className="text-[#8B948F] text-xs leading-relaxed mb-6">
                            Are you sure you want to unfollow <span className="text-[#F5F7F5] font-medium">{userToUnfollow.name}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setUserToUnfollow(null)}
                                className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-xs font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUnfollow}
                                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                                className="rounded-lg font-semibold px-4 py-2 text-xs hover:opacity-90 transition"
                            >
                                Unfollow
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
