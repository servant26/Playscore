import { useState, useEffect, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';

const PER_PAGE = 10;

export default function FollowListTab({ user, type = 'following' }) {
    const authUser = usePage().props.auth?.user;
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [userToUnfollow, setUserToUnfollow] = useState(null);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            setSearch('');
            setPage(1);
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
    }, [type, user?.id]);

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return usersList;
        const q = search.toLowerCase();
        return usersList.filter((u) => u.name.toLowerCase().includes(q));
    }, [search, usersList]);

    const totalPages = Math.ceil(filteredUsers.length / PER_PAGE) || 1;
    const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleUserClick = (userId) => {
        if (authUser && userId === authUser.id) {
            router.get(route('profile.edit'));
            return;
        }
        router.get(route('users.show', userId));
    };

    const handleToggleFollowClick = (u) => {
        if (u.is_following) {
            setUserToUnfollow(u);
        } else {
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
        <div className="space-y-4 w-full">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-[#F5F7F5] text-base sm:text-lg font-semibold capitalize">
                    {type} ({filteredUsers.length})
                </h3>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={`Search ${type}...`}
                    className="w-full sm:w-64 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center text-[#5A625D] text-sm">
                    Loading {type}...
                </div>
            ) : paginatedUsers.length === 0 ? (
                <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-12 text-center text-[#8B948F] text-sm">
                    {usersList.length === 0
                        ? `No ${type} yet.`
                        : `No users matching "${search}".`}
                </div>
            ) : (
                <div className="space-y-3 w-full">
                    {paginatedUsers.map((u) => (
                        <div
                            key={u.id}
                            className="w-full bg-[#131916] border border-[#1F2923] hover:border-[#2E3A32] rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-4 transition"
                        >
                            <div
                                onClick={() => handleUserClick(u.id)}
                                className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#0B0F0D] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm font-semibold overflow-hidden shrink-0 group-hover:border-[#22C55E] transition">
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
                                    <h4 className="text-[#F5F7F5] text-sm sm:text-base font-medium truncate group-hover:text-[#22C55E] transition flex items-center gap-2">
                                        <span>{u.name}</span>
                                        {(u.is_self || (authUser && u.id === authUser.id)) && (
                                            <span className="text-[#22C55E] text-xs font-semibold bg-[#22C55E]/10 px-2 py-0.5 rounded">
                                                You
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-[#5A625D] text-xs mt-0.5">
                                        {u.reviews_count} {u.reviews_count === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>
                            </div>

                            {!u.is_self && (
                                <button
                                    onClick={() => handleToggleFollowClick(u)}
                                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shrink-0 ${
                                        u.is_following
                                            ? 'bg-[#1F2923] text-[#8B948F] hover:bg-[#2E3A32] hover:text-[#DC2626]'
                                            : 'bg-[#22C55E] text-[#0B0F0D] hover:bg-[#16A34A]'
                                    }`}
                                >
                                    {u.is_following ? 'Following' : '+ Follow'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-3 py-1.5 text-sm hover:border-[#2E3A32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                p === page
                                    ? 'bg-[#22C55E] text-[#0B0F0D] font-medium'
                                    : 'border border-[#1F2923] text-[#8B948F] hover:border-[#2E3A32]'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-3 py-1.5 text-sm hover:border-[#2E3A32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

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
