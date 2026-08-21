import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function AdminDashboard({ resetRequests, users, stats }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'users' | 'blog'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const filteredRequests = resetRequests.filter(
        (r) =>
            r.status === 'pending' &&
            (r.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.user_email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
            return avatar;
        }
        return `/storage/${avatar}`;
    };

    const handleApproveRequest = () => {
        if (!selectedRequest) return;
        router.post(
            route('admin.requests.approve', selectedRequest.id),
            {},
            {
                onSuccess: () => setSelectedRequest(null),
            }
        );
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;
        router.delete(
            route('admin.users.delete', userToDelete.id),
            {
                onSuccess: () => setUserToDelete(null),
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2923] pb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7F5]">
                                Admin Control Panel
                            </h1>
                        </div>
                        <p className="text-[#8B948F] text-sm mt-1">
                            Manage user accounts and handle password reset requests for Playscore.
                        </p>
                    </div>
                </div>

                {/* Success Flash Notification */}
                {flash?.success && (
                    <div className="bg-[#132015] border border-[#1F3D26] text-[#22C55E] text-sm px-4 py-3 rounded-xl flex items-center justify-between">
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#131916] border border-[#1F2923] p-5 rounded-2xl">
                        <p className="text-[#8B948F] text-xs font-medium uppercase tracking-wider">
                            Total Users
                        </p>
                        <p className="text-3xl font-bold text-[#F5F7F5] mt-2">
                            {stats.total_users}
                        </p>
                    </div>
                    <div className="bg-[#131916] border border-[#1F2923] p-5 rounded-2xl">
                        <p className="text-[#8B948F] text-xs font-medium uppercase tracking-wider">
                            Pending Reset Requests
                        </p>
                        <p className="text-3xl font-bold text-[#EAB308] mt-2">
                            {stats.pending_requests}
                        </p>
                    </div>
                    <div className="bg-[#131916] border border-[#1F2923] p-5 rounded-2xl">
                        <p className="text-[#8B948F] text-xs font-medium uppercase tracking-wider">
                            Approved Resets
                        </p>
                        <p className="text-3xl font-bold text-[#22C55E] mt-2">
                            {stats.approved_requests}
                        </p>
                    </div>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131916] border border-[#1F2923] p-3 rounded-2xl">
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                                activeTab === 'requests'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                            }`}
                        >
                            Reset Requests ({resetRequests.filter((r) => r.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                                activeTab === 'users'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                            }`}
                        >
                            All Users ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('blog')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                                activeTab === 'blog'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#1F2923]'
                            }`}
                        >
                            Write Blog <span className="text-[10px] ml-1 bg-[#1F2923] text-[#8B948F] px-1.5 py-0.5 rounded">Soon</span>
                        </button>
                    </div>

                    {activeTab !== 'blog' && (
                        <div className="w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0B0F0D] border border-[#1F2923] rounded-xl px-4 py-2 text-sm text-[#F5F7F5] placeholder-[#5A625D] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                            />
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="bg-[#131916] border border-[#1F2923] rounded-2xl overflow-hidden shadow-xl">
                    {activeTab === 'requests' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#8B948F]">
                                <thead className="bg-[#0B0F0D] text-[#F5F7F5] text-xs uppercase border-b border-[#1F2923]">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Request Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F2923]">
                                    {filteredRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-[#5A625D]">
                                                No password reset requests found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRequests.map((req) => (
                                            <tr key={req.id} className="hover:bg-[#1A231E]/50 transition">
                                                <td className="px-6 py-4 font-medium text-[#F5F7F5] flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-[#22C55E]/30 shrink-0">
                                                        {getAvatarUrl(req.user_avatar) ? (
                                                            <img src={getAvatarUrl(req.user_avatar)} alt={req.user_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            req.user_name ? req.user_name[0] : '?'
                                                        )}
                                                    </div>
                                                    <span>{req.user_name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-[#F5F7F5]">{req.user_email}</td>
                                                <td className="px-6 py-4 text-xs">{req.created_at}</td>
                                                <td className="px-6 py-4">
                                                    {req.status === 'pending' ? (
                                                        <span className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                            Pending
                                                        </span>
                                                    ) : (
                                                        <span className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                            Completed ({req.reset_at})
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {req.status === 'pending' ? (
                                                        <button
                                                            onClick={() => setSelectedRequest(req)}
                                                            className="bg-[#22C55E] text-[#0B0F0D] hover:bg-[#4ADE80] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                                                        >
                                                            Reset Password
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-[#5A625D]">Reset Completed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#8B948F]">
                                <thead className="bg-[#0B0F0D] text-[#F5F7F5] text-xs uppercase border-b border-[#1F2923]">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Joined Date</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F2923]">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-[#5A625D]">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-[#1A231E]/50 transition">
                                                <td className="px-6 py-4 font-medium text-[#F5F7F5] flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-[#22C55E]/30 shrink-0">
                                                        {getAvatarUrl(u.avatar) ? (
                                                            <img src={getAvatarUrl(u.avatar)} alt={u.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            u.name ? u.name[0] : '?'
                                                        )}
                                                    </div>
                                                    <span>{u.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-[#F5F7F5]">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    {u.role === 'admin' ? (
                                                        <span className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="bg-[#1F2923] text-[#8B948F] px-2.5 py-1 rounded-full text-xs font-medium">
                                                            User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs">{u.created_at}</td>
                                                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setUserToDelete(u)}
                                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Blog Placeholder Tab */
                        <div className="p-12 text-center space-y-3">
                            <h3 className="text-lg font-bold text-[#F5F7F5]">
                                Blog Publishing Feature (Coming Soon)
                            </h3>
                            <p className="text-[#8B948F] text-sm max-w-md mx-auto">
                                This feature will allow Administrators to write, publish, and manage blog posts and announcement updates directly on Playscore.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Modal for Request Approval */}
            <ConfirmModal
                show={selectedRequest !== null}
                title="Confirm Password Reset"
                message={`Are you sure you want to approve the password reset request for "${selectedRequest?.user_email}"? The password will be reset to "12345678".`}
                onConfirm={handleApproveRequest}
                onCancel={() => setSelectedRequest(null)}
                confirmLabel="Reset Password"
                variant="danger"
            />

            {/* Confirm Modal for User Deletion */}
            <ConfirmModal
                show={userToDelete !== null}
                title="Delete User Account"
                message={`Are you sure you want to permanently delete the user account for "${userToDelete?.name}" (${userToDelete?.email})? All associated data and lists will be permanently removed.`}
                onConfirm={handleDeleteUser}
                onCancel={() => setUserToDelete(null)}
                confirmLabel="Delete User"
            />
        </AppLayout>
    );
}

