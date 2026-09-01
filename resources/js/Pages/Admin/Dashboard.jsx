import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function AdminDashboard({ resetRequests = [], users = [], articles = [], stats = {} }) {
    const { flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(false);

    // Auto-hide flash message notification after 3 seconds
    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShowFlash(false);
        }
    }, [flash?.success]);

    // Tabs: 'requests' | 'users' | 'blog'
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'users') return 'users';
            if (hash === 'blog') return 'blog';
            const saved = localStorage.getItem('playscore_admin_tab');
            if (saved) return saved;
        }
        return 'requests';
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [articleToArchive, setArticleToArchive] = useState(null);

    // Pagination Pages per Tab (10 items per page)
    const [requestsPage, setRequestsPage] = useState(1);
    const [usersPage, setUsersPage] = useState(1);
    const [blogPage, setBlogPage] = useState(1);
    const itemsPerPage = 10;

    // Blog Articles Table Filters & Sorting State
    const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
    const [blogStatusFilter, setBlogStatusFilter] = useState('All');
    const [blogSortField, setBlogSortField] = useState('created_at'); // 'title' | 'category' | 'status' | 'created_at'
    const [blogSortOrder, setBlogSortOrder] = useState('desc'); // 'asc' | 'desc'

    // Custom Dropdown Open States & Refs
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const categoryRef = useRef(null);
    const statusRef = useRef(null);
    const searchInputRef = useRef(null);

    // Force focus on search input whenever activeTab changes
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [activeTab]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryDropdownOpen(false);
            }
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setStatusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setSearchQuery('');
        if (typeof window !== 'undefined') {
            localStorage.setItem('playscore_admin_tab', tabKey);
            window.history.replaceState({}, '', `#${tabKey}`);
        }
    };

    // Filter Requests
    const filteredRequests = useMemo(() => {
        return resetRequests.filter(
            (r) =>
                r.status === 'pending' &&
                (r.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.user_email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [resetRequests, searchQuery]);

    // Paginated Requests
    const paginatedRequests = useMemo(() => {
        const start = (requestsPage - 1) * itemsPerPage;
        return filteredRequests.slice(start, start + itemsPerPage);
    }, [filteredRequests, requestsPage]);

    const totalRequestsPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;

    // Filter Users
    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    // Paginated Users
    const paginatedUsers = useMemo(() => {
        const start = (usersPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, usersPage]);

    const totalUsersPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

    // Filter and Sort Blog Articles
    const processedArticles = useMemo(() => {
        let result = articles.filter((a) => {
            const matchesSearch =
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (a.publisher && a.publisher.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = blogCategoryFilter === 'All' || a.category === blogCategoryFilter;
            const matchesStatus = blogStatusFilter === 'All' || a.status === blogStatusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Sorting
        result.sort((a, b) => {
            let aVal = a[blogSortField] || '';
            let bVal = b[blogSortField] || '';

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return blogSortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return blogSortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [articles, searchQuery, blogCategoryFilter, blogStatusFilter, blogSortField, blogSortOrder]);

    // Paginated Blog Articles
    const paginatedArticles = useMemo(() => {
        const start = (blogPage - 1) * itemsPerPage;
        return processedArticles.slice(start, start + itemsPerPage);
    }, [processedArticles, blogPage]);

    const totalBlogPages = Math.ceil(processedArticles.length / itemsPerPage) || 1;

    // Available categories list for filter dropdown
    const availableCategories = useMemo(() => {
        const cats = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));
        return ['All', ...cats];
    }, [articles]);

    // Category count map
    const categoryCounts = useMemo(() => {
        const counts = { All: articles.length };
        articles.forEach((a) => {
            if (a.category) {
                counts[a.category] = (counts[a.category] || 0) + 1;
            }
        });
        return counts;
    }, [articles]);

    // Status count map
    const statusCounts = useMemo(() => {
        const counts = {
            All: articles.length,
            published: articles.filter((a) => a.status === 'published').length,
            archived: articles.filter((a) => a.status === 'archived').length,
        };
        return counts;
    }, [articles]);

    const handleSort = (field) => {
        if (blogSortField === field) {
            setBlogSortOrder(blogSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setBlogSortField(field);
            setBlogSortOrder('asc');
        }
    };

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

    const handleToggleArticleStatus = (art) => {
        router.patch(route('admin.articles.toggle-status', art.id));
    };

    const handleArchiveArticleConfirm = () => {
        if (!articleToArchive) return;
        router.patch(
            route('admin.articles.toggle-status', articleToArchive.id),
            {},
            {
                onSuccess: () => setArticleToArchive(null),
            }
        );
    };

    const ADMIN_TABS = [
        { key: 'requests', label: 'Password Reset Requests', count: resetRequests.filter((r) => r.status === 'pending').length },
        { key: 'users', label: 'User Management', count: users.length },
        { key: 'blog', label: 'Blog & Articles', count: articles.length },
    ];

    const STATUS_FILTER_OPTIONS = [
        { value: 'All', label: 'All Status' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
    ];

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="max-w-6xl mx-auto w-full py-4 sm:py-6 space-y-6">
                {/* Header with Flash Message aligned to the right */}
                <div className="border-b border-[#1F2923] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7F5]">
                            Admin Control Panel
                        </h1>
                        <p className="text-[#8B948F] text-sm mt-1">
                            Manage user accounts, handle password reset requests, and publish blog articles.
                        </p>
                    </div>

                    {/* Success Flash Notification Banner (Inline Right - Auto-hides in 3s) */}
                    {showFlash && flash?.success && (
                        <div className={`text-xs font-semibold px-4 py-2.5 rounded-xl shrink-0 transition-opacity duration-300 ${
                            flash.success.toLowerCase().includes('archived')
                                ? 'bg-red-950/40 border border-red-900/60 text-red-400'
                                : 'bg-[#132015] border border-[#1F3D26] text-[#22C55E]'
                        }`}>
                            {flash.success}
                        </div>
                    )}
                </div>

                {/* Sidebar Navigation & Content Layout */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Sidebar Menu */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <nav className="flex lg:flex-col overflow-x-auto pb-1 lg:pb-0 gap-1.5 scrollbar-none">
                            {ADMIN_TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`text-left whitespace-nowrap px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-2.5 shrink-0 ${
                                        activeTab === tab.key
                                            ? 'bg-[#22C55E] text-[#0B0F0D]'
                                            : 'text-[#8B948F] bg-[#131916] lg:bg-transparent border border-[#1F2923] lg:border-0 hover:bg-[#131916] hover:text-[#F5F7F5]'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            activeTab === tab.key
                                                ? 'bg-[#0B0F0D]/20 text-[#0B0F0D]'
                                                : 'bg-[#161F1A] text-[#8B948F]'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0 space-y-4">
                        
                        {/* Search & Actions Bar (Tablet & Mobile Optimized Grid) */}
                        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 bg-[#131916] border border-[#1F2923] p-3.5 sm:p-4 rounded-2xl">
                            <h2 className="text-sm sm:text-base font-bold text-[#F5F7F5] px-1 shrink-0">
                                {activeTab === 'requests' && 'Pending Reset Requests'}
                                {activeTab === 'users' && 'All Registered Users'}
                                {activeTab === 'blog' && 'Blog Articles & News Feed'}
                            </h2>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
                                {/* Search Input (With ref focus & 'Search data...' placeholder) */}
                                <div className="w-full sm:flex-1 md:w-52 lg:w-60">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        autoFocus
                                        placeholder="Search data..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setRequestsPage(1);
                                            setUsersPage(1);
                                            setBlogPage(1);
                                        }}
                                        className="w-full bg-[#0E1411] border border-[#1F2923] hover:border-[#22C55E]/40 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#F5F7F5] placeholder-[#8B948F] focus:outline-none focus:border-[#22C55E] transition"
                                    />
                                </div>

                                {/* Custom Category & Status Dropdowns + Create Button (Responsive Flex Container) */}
                                {activeTab === 'blog' && (
                                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                                        {/* Category Filter Dropdown */}
                                        <div className="relative col-span-1 sm:w-auto" ref={categoryRef}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCategoryDropdownOpen(!categoryDropdownOpen);
                                                    setStatusDropdownOpen(false);
                                                }}
                                                className="w-full sm:w-auto flex items-center justify-between gap-2 bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-[#F5F7F5] text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition shadow-sm"
                                            >
                                                <span className="truncate">
                                                    {blogCategoryFilter === 'All' ? 'All Categories' : blogCategoryFilter}
                                                </span>
                                                <svg
                                                    className={`w-4 h-4 text-[#8B948F] transition-transform duration-200 shrink-0 ${
                                                        categoryDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {categoryDropdownOpen && (
                                                <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-full sm:w-52 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl py-1.5 z-30 overflow-hidden">
                                                    {availableCategories.map((cat) => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => {
                                                                setBlogCategoryFilter(cat);
                                                                setBlogPage(1);
                                                                setCategoryDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                                                                blogCategoryFilter === cat
                                                                    ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                                    : 'text-[#8B948F] hover:bg-[#1F2923] hover:text-[#F5F7F5]'
                                                            }`}
                                                        >
                                                            <span className="truncate">{cat === 'All' ? 'All Categories' : cat}</span>
                                                            <span className="text-xs font-semibold opacity-90 ml-2">
                                                                {categoryCounts[cat] || 0}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Filter Dropdown */}
                                        <div className="relative col-span-1 sm:w-auto" ref={statusRef}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStatusDropdownOpen(!statusDropdownOpen);
                                                    setCategoryDropdownOpen(false);
                                                }}
                                                className="w-full sm:w-auto flex items-center justify-between gap-2 bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-[#F5F7F5] text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition shadow-sm"
                                            >
                                                <span className="truncate">
                                                    {STATUS_FILTER_OPTIONS.find((s) => s.value === blogStatusFilter)?.label || 'All Status'}
                                                </span>
                                                <svg
                                                    className={`w-4 h-4 text-[#8B948F] transition-transform duration-200 shrink-0 ${
                                                        statusDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {statusDropdownOpen && (
                                                <div className="absolute right-0 mt-1.5 w-full sm:w-44 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl py-1.5 z-30 overflow-hidden">
                                                    {STATUS_FILTER_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setBlogStatusFilter(opt.value);
                                                                setBlogPage(1);
                                                                setStatusDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                                                                blogStatusFilter === opt.value
                                                                    ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                                    : 'text-[#8B948F] hover:bg-[#1F2923] hover:text-[#F5F7F5]'
                                                            }`}
                                                        >
                                                            <span className="truncate">{opt.label}</span>
                                                            <span className="text-xs font-semibold opacity-90 ml-2">
                                                                {statusCounts[opt.value] || 0}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Create Article Button */}
                                        <Link
                                            href={route('admin.articles.create')}
                                            className="col-span-2 sm:col-span-1 px-4 py-2 rounded-lg bg-[#22C55E] text-[#0B0F0D] font-bold text-xs sm:text-sm hover:bg-[#4ADE80] transition shadow-md shadow-[#22C55E]/20 inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
                                        >
                                            <span>+ Create Article</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="bg-[#131916] border border-[#1F2923] rounded-2xl overflow-hidden shadow-xl">
                            
                            {/* TAB 1: RESET REQUESTS */}
                            {activeTab === 'requests' && (
                                <>
                                    <div className="overflow-x-auto overflow-y-auto max-h-[310px] custom-scrollbar">
                                        <table className="w-full text-left text-sm text-[#8B948F]">
                                            <thead className="bg-[#0B0F0D] text-[#F5F7F5] uppercase text-xs border-b border-[#1F2923] sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Email</th>
                                                    <th className="px-6 py-4">Requested</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1F2923]">
                                                {paginatedRequests.length > 0 ? (
                                                    paginatedRequests.map((req) => (
                                                        <tr key={req.id} className="hover:bg-[#161F1A]/50 transition">
                                                            <td className="px-4 sm:px-6 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    {req.user_avatar ? (
                                                                        <img
                                                                            src={getAvatarUrl(req.user_avatar)}
                                                                            alt={req.user_name}
                                                                            className="w-8 h-8 rounded-full object-cover border border-[#1F2923] hidden sm:block"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xs flex items-center justify-center hidden sm:flex">
                                                                            {req.user_name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="font-bold text-[#F5F7F5] text-xs sm:text-sm">{req.user_name}</p>
                                                                        <p className="text-[10px] text-[#8B948F]">ID: #{req.user_id}</p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 font-mono text-xs text-[#F5F7F5]">
                                                                {req.user_email}
                                                            </td>

                                                            <td className="px-6 py-4 text-xs text-[#8B948F]">
                                                                {req.created_at}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                                                                    Pending
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => setSelectedRequest(req)}
                                                                    className="px-3.5 py-1.5 rounded-lg bg-[#22C55E] text-[#0B0F0D] font-bold text-xs hover:bg-[#4ADE80] transition shadow-md shadow-[#22C55E]/10"
                                                                >
                                                                    Approve Reset
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center text-[#8B948F]">
                                                            No pending reset requests.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalRequestsPages > 1 && (
                                        <div className="px-6 py-3 border-t border-[#1F2923] flex items-center justify-between bg-[#0E1411]">
                                            <span className="text-xs text-[#8B948F]">
                                                Showing page {requestsPage} of {totalRequestsPages} ({filteredRequests.length} total)
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={requestsPage === 1}
                                                    onClick={() => setRequestsPage((p) => Math.max(p - 1, 1))}
                                                    className="px-3 py-1 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] disabled:opacity-40 hover:text-white"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    disabled={requestsPage === totalRequestsPages}
                                                    onClick={() => setRequestsPage((p) => Math.min(p + 1, totalRequestsPages))}
                                                    className="px-3 py-1 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] disabled:opacity-40 hover:text-white"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* TAB 2: USER MANAGEMENT */}
                            {activeTab === 'users' && (
                                <>
                                    <div className="overflow-x-auto overflow-y-auto max-h-[310px] custom-scrollbar">
                                        <table className="w-full text-left text-sm text-[#8B948F]">
                                            <thead className="bg-[#0B0F0D] text-[#F5F7F5] uppercase text-xs border-b border-[#1F2923] sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Email</th>
                                                    <th className="px-6 py-4">Role</th>
                                                    <th className="px-6 py-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1F2923]">
                                                {paginatedUsers.length > 0 ? (
                                                    paginatedUsers.map((u) => (
                                                        <tr key={u.id} className="hover:bg-[#161F1A]/50 transition">
                                                            <td className="px-4 sm:px-6 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    {u.avatar ? (
                                                                        <img
                                                                            src={getAvatarUrl(u.avatar)}
                                                                            alt={u.name}
                                                                            className="w-8 h-8 rounded-full object-cover border border-[#1F2923] hidden sm:block"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xs flex items-center justify-center hidden sm:flex">
                                                                            {u.name.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                    <span className="font-bold text-[#F5F7F5] text-xs sm:text-sm">{u.name}</span>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 font-mono text-xs text-[#F5F7F5]">
                                                                {u.email}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <span className="px-2.5 py-1 rounded-md bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F]">
                                                                    {u.role || 'User'}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => setUserToDelete(u)}
                                                                    className="px-3.5 py-1.5 rounded-lg bg-red-950/30 border border-red-900/40 text-xs font-semibold text-red-400 hover:bg-red-900/50 transition"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center text-[#8B948F]">
                                                            No users found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalUsersPages > 1 && (
                                        <div className="px-6 py-3 border-t border-[#1F2923] flex items-center justify-between bg-[#0E1411]">
                                            <span className="text-xs text-[#8B948F]">
                                                Showing page {usersPage} of {totalUsersPages} ({filteredUsers.length} total)
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={usersPage === 1}
                                                    onClick={() => setUsersPage((p) => Math.max(p - 1, 1))}
                                                    className="px-3 py-1 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] disabled:opacity-40 hover:text-white"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    disabled={usersPage === totalUsersPages}
                                                    onClick={() => setUsersPage((p) => Math.min(p + 1, totalUsersPages))}
                                                    className="px-3 py-1 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] disabled:opacity-40 hover:text-white"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* TAB 3: STREAMLINED ARTICLES DATATABLE (10 items/page, Archive instead of Delete) */}
                            {activeTab === 'blog' && (
                                <>
                                    <div className="overflow-x-auto overflow-y-auto max-h-[310px] custom-scrollbar">
                                        <table className="w-full text-left text-sm text-[#8B948F]">
                                            <thead className="bg-[#0B0F0D] text-[#F5F7F5] uppercase text-xs border-b border-[#1F2923] sticky top-0 z-10">
                                                <tr>
                                                    {/* Articles Column (Sortable & Widened with line-clamp) */}
                                                    <th
                                                        onClick={() => handleSort('title')}
                                                        className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#22C55E] transition select-none min-w-[200px] sm:min-w-[320px]"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <span>Articles</span>
                                                            {blogSortField === 'title' && (
                                                                <span>{blogSortOrder === 'asc' ? '▲' : '▼'}</span>
                                                            )}
                                                        </div>
                                                    </th>

                                                    {/* Category Column (Sortable) */}
                                                    <th
                                                        onClick={() => handleSort('category')}
                                                        className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#22C55E] transition select-none"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <span>Category</span>
                                                            {blogSortField === 'category' && (
                                                                <span>{blogSortOrder === 'asc' ? '▲' : '▼'}</span>
                                                            )}
                                                        </div>
                                                    </th>

                                                    {/* Status Column (Sortable) */}
                                                    <th
                                                        onClick={() => handleSort('status')}
                                                        className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#22C55E] transition select-none"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <span>Status</span>
                                                            {blogSortField === 'status' && (
                                                                <span>{blogSortOrder === 'asc' ? '▲' : '▼'}</span>
                                                            )}
                                                        </div>
                                                    </th>

                                                    {/* Actions Column */}
                                                    <th className="px-4 sm:px-6 py-3.5 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1F2923]">
                                                {paginatedArticles.length > 0 ? (
                                                    paginatedArticles.map((art) => (
                                                        <tr key={art.id} className="hover:bg-[#161F1A]/50 transition">
                                                            {/* Articles: Cover Image (Hidden on Mobile) + Clamped Title */}
                                                            <td className="px-4 sm:px-6 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    {art.cover ? (
                                                                        <img
                                                                            src={art.cover}
                                                                            alt={art.title}
                                                                            className="w-10 h-10 rounded-lg object-cover bg-[#0B0F0D] border border-[#1F2923] shrink-0 hidden sm:block"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-lg bg-[#161F1A] border border-[#1F2923] shrink-0 flex items-center justify-center text-[10px] text-[#8B948F] hidden sm:flex">
                                                                            No Cover
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0 max-w-[240px] sm:max-w-md lg:max-w-xl">
                                                                        <h3 className="font-bold text-[#F5F7F5] text-xs sm:text-sm leading-snug line-clamp-2">
                                                                            {art.title}
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Category */}
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2.5 py-1 rounded-md bg-[#161F1A] border border-[#22C55E]/20 text-[#22C55E] text-xs font-semibold">
                                                                    {art.category}
                                                                </span>
                                                            </td>

                                                            {/* Status */}
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <button
                                                                    onClick={() => handleToggleArticleStatus(art)}
                                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                                                                        art.status === 'published'
                                                                            ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20'
                                                                            : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                                                                    }`}
                                                                    title="Click to toggle status"
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${art.status === 'published' ? 'bg-[#22C55E]' : 'bg-red-400'}`} />
                                                                    <span className="capitalize">{art.status}</span>
                                                                </button>
                                                            </td>

                                                            {/* Actions (Edit Only) */}
                                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                <Link
                                                                    href={route('admin.articles.edit', art.id)}
                                                                    className="px-3.5 py-1.5 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs font-semibold text-[#F5F7F5] hover:text-[#22C55E] hover:border-[#22C55E]/40 transition inline-block"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center text-[#8B948F]">
                                                            No articles found matching your search or filter.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalBlogPages > 1 && (
                                        <div className="px-6 py-3 border-t border-[#1F2923] flex items-center justify-between bg-[#0E1411]">
                                            <span className="text-xs text-[#8B948F]">
                                                Showing page {blogPage} of {totalBlogPages} ({processedArticles.length} total)
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={blogPage === 1}
                                                    onClick={() => setBlogPage((p) => Math.max(p - 1, 1))}
                                                    className="px-3 py-1 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] disabled:opacity-40 hover:text-white"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    disabled={blogPage === totalBlogPages}
                                                    onClick={() => setBlogPage((p) => Math.min(p + 1, totalBlogPages))}
                                                    className="px-3 py-1 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] disabled:opacity-40 hover:text-white"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Approve Reset Modal */}
            <ConfirmModal
                show={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onConfirm={handleApproveRequest}
                title="Approve Password Reset"
                message={`Are you sure you want to reset password for ${selectedRequest?.user_name} (${selectedRequest?.user_email}) to "12345678"?`}
                confirmText="Approve Reset"
            />

            {/* Confirm Delete User Modal */}
            <ConfirmModal
                show={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDeleteUser}
                title="Delete User Account"
                message={`Are you sure you want to permanently delete user "${userToDelete?.name}" (${userToDelete?.email})?`}
                confirmText="Delete Account"
            />

            {/* Confirm Archive / Publish Article Modal */}
            <ConfirmModal
                show={!!articleToArchive}
                onClose={() => setArticleToArchive(null)}
                onConfirm={handleArchiveArticleConfirm}
                title={articleToArchive?.status === 'published' ? 'Archive Article' : 'Publish Article'}
                message={`Are you sure you want to ${articleToArchive?.status === 'published' ? 'archive' : 'publish'} "${articleToArchive?.title}"?`}
                confirmText={articleToArchive?.status === 'published' ? 'Archive Article' : 'Publish Article'}
            />
        </AppLayout>
    );
}
