import AppLayout from '@/Layouts/AppLayout';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';
import Pagination from '@/Components/Pagination';
import GameCard from '@/Components/GameCard';
import Modal from '@/Components/Modal';
import FollowListTab from './Partials/FollowListTab';
import StatsTab from './Partials/StatsTab';
import StoryViewerModal from '@/Components/StoryViewerModal';
import HighlightSection from '@/Components/HighlightSection';
import RankInfoModal from '@/Components/RankInfoModal';
import { getRankInfo } from '@/Utils/rankSystem';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';

const PER_PAGE = 10;

export default function PublicShow({ profileUser, userStories = [], highlights = [], interests = [], myInterestIds = [], myReviewedGameIds = [], reviews, myListIds, stats }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showStoryViewer, setShowStoryViewer] = useState(false);
    const [showHighlightViewer, setShowHighlightViewer] = useState(false);
    const [showRankModal, setShowRankModal] = useState(false);
    const [highlightViewerStories, setHighlightViewerStories] = useState([]);
    const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
    const [listIds, setListIds] = useState(myListIds || []);
    const [search, setSearch] = useState('');
    const [reviewFilter, setReviewFilter] = useState('all');
    const [sortBy, setSortBy] = useState('rating_desc'); // rating_desc, latest_review, rating_asc, title_asc, title_desc, date_desc, date_asc
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('reviews');
    const [followSubTab, setFollowSubTab] = useState('following');

    const dropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    const [perPage, setPerPage] = useState(14);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setPerPage(14);
            } else if (window.innerWidth >= 640) {
                setPerPage(8);
            } else {
                setPerPage(10);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const authUser = usePage().props.auth?.user;
    const isOwner = authUser && authUser.id === profileUser.id;
    const { count, currentRank, nextRank, progress, isMax, reviewsNeeded } = getRankInfo(reviews ? reviews.length : 0);

    const [isFollowing, setIsFollowing] = useState(profileUser.is_following || false);
    const [followersCount, setFollowersCount] = useState(profileUser.followers_count || 0);

    const [viewedIds, setViewedIds] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('playscore_viewed_stories');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const handleStoryViewed = (storyId) => {
        setViewedIds((prev) => {
            if (prev.includes(storyId)) return prev;
            const updated = [...prev, storyId];
            try {
                localStorage.setItem('playscore_viewed_stories', JSON.stringify(updated));
            } catch {}
            return updated;
        });
    };

    const hasStories = userStories && userStories.length > 0;
    const hasUnviewedStories = hasStories && userStories.some((s) => !viewedIds.includes(s.id));

    const handleFollowButtonClick = () => {
        if (isFollowing) {
            setShowUnfollowConfirm(true);
        } else {
            setIsFollowing(true);
            setFollowersCount((prev) => prev + 1);
            router.post(
                route('users.follow', profileUser.id),
                {},
                { preserveScroll: true, preserveState: true }
            );
        }
    };

    const confirmUnfollowHeader = () => {
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        setShowUnfollowConfirm(false);
        router.post(
            route('users.follow', profileUser.id),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
            return avatar;
        }
        return `/storage/${avatar}`;
    };

    const avatarUrl = getAvatarUrl(profileUser.avatar);

    const initials = profileUser.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const goToGame = (slug) => {
        router.get(route('games.show', slug));
    };

    const openTrailer = (title) => {
        const query = encodeURIComponent(`${title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const toggleList = (gameId, gameSlug) => {
        const isInList = listIds.includes(gameId);

        setListIds((prev) =>
            isInList ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        );

        router.post(
            route('game-list.toggle', gameSlug),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const sharedReviewsCount = useMemo(() => {
        if (!reviews || !myReviewedGameIds) return 0;
        return reviews.filter((r) => r.game && myReviewedGameIds.includes(r.game.id)).length;
    }, [reviews, myReviewedGameIds]);

    const filtered = useMemo(() => {
        let list = reviews.filter((r) => {
            const matchesSearch = !search.trim()
                ? true
                : (r.game.title.toLowerCase().includes(search.toLowerCase()) ||
                   (r.body && r.body.toLowerCase().includes(search.toLowerCase())));
            const matchesShared = reviewFilter === 'shared'
                ? (r.game && myReviewedGameIds.includes(r.game.id))
                : true;
            return matchesSearch && matchesShared;
        });

        if (sortBy === 'title_asc') {
            list.sort((a, b) => a.game.title.localeCompare(b.game.title));
        } else if (sortBy === 'title_desc') {
            list.sort((a, b) => b.game.title.localeCompare(a.game.title));
        } else if (sortBy === 'rating_desc') {
            list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'rating_asc') {
            list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else if (sortBy === 'date_desc') {
            list.sort((a, b) => new Date(b.game.release_date || 0) - new Date(a.game.release_date || 0));
        } else if (sortBy === 'date_asc') {
            list.sort((a, b) => new Date(a.game.release_date || 0) - new Date(b.game.release_date || 0));
        } else if (sortBy === 'latest_review') {
            list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        return list;
    }, [search, reviews, reviewFilter, myReviewedGameIds, sortBy]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <AppLayout>
            <Head title={profileUser.name} />

            <div className="max-w-[1216px] mx-auto w-full">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (hasStories) {
                                    setShowStoryViewer(true);
                                } else {
                                    setShowAvatarModal(true);
                                }
                            }}
                            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full transition flex items-center justify-center shrink-0 cursor-pointer ${
                                !hasStories
                                    ? 'border-2 border-solid border-[#1F2923] hover:border-[#22C55E] bg-[#131916]'
                                    : hasUnviewedStories
                                    ? 'p-[3px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] hover:scale-105'
                                    : 'border-2 border-[#1F2923] hover:border-[#2E3A32] opacity-75 hover:scale-105 bg-[#131916]'
                            }`}
                            style={{ minWidth: '56px', minHeight: '56px' }}
                            title={hasStories ? "Click to view story" : "Click to view photo"}
                        >
                            <div className="w-full h-full rounded-full bg-[#131916] flex items-center justify-center overflow-hidden text-lg sm:text-xl font-semibold">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={profileUser.name}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextSibling) {
                                                e.target.nextSibling.style.display = 'block';
                                            }
                                        }}
                                    />
                                ) : null}
                                <span
                                    style={{ display: avatarUrl ? 'none' : 'block' }}
                                    className={hasUnviewedStories ? "text-[#22C55E]" : "text-[#8B948F]"}
                                >
                                    {initials}
                                </span>
                            </div>
                            {hasStories && (
                                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B0F0D] flex items-center justify-center text-[9px] font-bold ${
                                    hasUnviewedStories ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#1F2923] text-[#8B948F]'
                                }`}>
                                    {userStories.length}
                                </span>
                            )}
                        </button>
                        <div>
                            <h1 className="text-[#F5F7F5] text-lg sm:text-xl font-semibold">{profileUser.name}</h1>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-[#8B948F] text-xs sm:text-sm">
                                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                </p>
                                <span className="text-[#38463E]">•</span>
                                <button
                                    type="button"
                                    onClick={() => setShowRankModal(true)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black border border-white/40 bg-[#19231E] text-white hover:bg-[#22332A] hover:border-white/70 transition-all duration-200 cursor-pointer shadow-md"
                                    title="Click to view rank details"
                                >
                                    <span className="text-sm">{currentRank.icon}</span>
                                    <span className="tracking-wide font-extrabold text-white" style={{ color: '#FFFFFF' }}>
                                        {currentRank.name}
                                    </span>
                                </button>
                            </div>

                            {/* Rank Progress Bar & Next Rank Requirement */}
                            {!isMax && nextRank ? (
                                <div className="mt-2 w-full max-w-[280px] sm:max-w-[320px]">
                                    <div className="flex items-center justify-between text-[11px] font-medium text-[#8B948F] mb-1">
                                        <span className="flex items-center gap-1">
                                            <span>{nextRank.icon}</span>
                                            <span>
                                                Progress to <strong className={`font-semibold ${nextRank.color}`}>{nextRank.name}</strong> ({nextRank.min} Reviews)
                                            </span>
                                        </span>
                                        <span className="text-[#F5F7F5] font-bold text-[10px] ml-2 shrink-0">
                                            {count} / {currentRank.target}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-[#0B0F0D] border border-[#1F2923] overflow-hidden p-[1px]">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[11px] text-[#22C55E] font-bold mt-1.5">
                                    Max Rank Achieved! ⚡
                                </p>
                            )}
                        </div>
                    </div>

                    {!isOwner && (
                        <button
                            onClick={handleFollowButtonClick}
                            className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition shrink-0 ${
                                isFollowing
                                    ? 'bg-[#1F2923] text-[#8B948F] hover:bg-[#2E3A32] hover:text-[#DC2626]'
                                    : 'bg-[#22C55E] text-[#0B0F0D] hover:bg-[#16A34A]'
                            }`}
                        >
                            {isFollowing ? 'Following' : '+ Follow'}
                        </button>
                    )}
                </div>

                {/* Interests inline with header: max 2 rows, scrollable */}
                {interests.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 max-h-[76px] overflow-y-auto custom-scrollbar pr-1">
                            {interests.map((interest) => {
                                const isShared = !isOwner && myInterestIds && myInterestIds.includes(interest.id);
                                return (
                                    <span
                                        key={interest.id}
                                        className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold transition cursor-default flex items-center gap-1.5 shrink-0 ${
                                            isShared
                                                ? 'bg-[#22C55E] border border-[#22C55E] text-[#0B0F0D] shadow-md'
                                                : 'bg-[#131916] border border-[#1F2923] text-[#8B948F] hover:border-[#2E3A32] hover:text-[#F5F7F5]'
                                        }`}
                                        title={isShared ? `Shared Interest! You both like ${interest.name}` : interest.name}
                                    >
                                        {isShared && <span className="text-[11px] font-bold">✓</span>}
                                        <span>{interest.name}</span>
                                    </span>
                                );
                            })}
                        </div>
                        {!isOwner && myInterestIds && interests.filter((i) => myInterestIds.includes(i.id)).length > 0 && (
                            <p className="text-[#22C55E] hover:text-[#15803D] transition-colors duration-200 text-xs font-medium mt-2.5 px-3.5 cursor-default select-none">
                                You share {interests.filter((i) => myInterestIds.includes(i.id)).length} {interests.filter((i) => myInterestIds.includes(i.id)).length === 1 ? 'genre interest' : 'genre interests'} with {profileUser.name}
                            </p>
                        )}
                    </div>
                )}

                {/* Highlights Section (Above Gamer Rank / Profile Tabs) */}
                <div className="mb-4">
                    <HighlightSection
                        highlights={highlights}
                        isOwner={false}
                        myStories={userStories}
                        onSelectHighlight={(hl) => {
                            setHighlightViewerStories(hl.stories || []);
                            setShowHighlightViewer(true);
                        }}
                    />
                </div>

                {/* Profile Tabs Header Navigation */}
                <div className="flex border-b border-[#1F2923] mb-6 overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'reviews'
                            ? 'border-[#22C55E] text-[#22C55E]'
                            : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                    >
                        Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'stats'
                            ? 'border-[#22C55E] text-[#22C55E]'
                            : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                    >
                        Stats
                    </button>
                    <button
                        onClick={() => setActiveTab('follow')}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'follow'
                            ? 'border-[#22C55E] text-[#22C55E]'
                            : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                            }`}
                    >
                        Following & Followers
                    </button>
                </div>

                {activeTab === 'stats' ? (
                    <StatsTab stats={stats} myReviews={reviews} user={profileUser} showDownload={isOwner} />
                ) : activeTab === 'follow' ? (
                    <div>
                        <div className="flex border-b border-[#1F2923] mb-6 overflow-x-auto scrollbar-none">
                            <button
                                onClick={() => setFollowSubTab('following')}
                                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${followSubTab === 'following'
                                    ? 'border-[#22C55E] text-[#22C55E]'
                                    : 'border-transparent text-[#8B948F] hover:text-[#F5F7F5]'
                                    }`}
                            >
                                Following ({profileUser.following_count || 0})
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
                        <FollowListTab user={profileUser} type={followSubTab} />
                    </div>
                ) : (
                    <>
                        {/* Reviews Header: title + dropdown filter & search form in single block */}
                        <div className="space-y-2.5 mb-4">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-[#F5F7F5] text-sm sm:text-lg font-semibold">
                                    {reviewFilter === 'shared' ? 'Shared Reviews' : 'All Reviews'}
                                </h2>

                                {/* Sorting & Filter Controls inline with title on mobile */}
                                <div className="flex items-center gap-2">
                                    {!isOwner && myReviewedGameIds && myReviewedGameIds.length > 0 && (
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                                className="flex items-center gap-1.5 bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-[#F5F7F5] text-[11px] sm:text-sm font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition shadow-sm"
                                            >
                                                <span>
                                                    {reviewFilter === 'all'
                                                        ? `All (${reviews.length})`
                                                        : `Shared (${sharedReviewsCount})`}
                                                </span>
                                                <svg
                                                    className={`w-3.5 h-3.5 text-[#8B948F] transition-transform duration-200 ${
                                                        isDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {isDropdownOpen && (
                                                <div className="absolute right-0 mt-1.5 w-48 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl py-1.5 z-20 overflow-hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReviewFilter('all');
                                                            setPage(1);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                                                            reviewFilter === 'all'
                                                                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                                : 'text-[#8B948F] hover:bg-[#1F2923] hover:text-[#F5F7F5]'
                                                        }`}
                                                    >
                                                        <span>All Reviews</span>
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1F2923] text-[#F5F7F5]">
                                                            {reviews.length}
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReviewFilter('shared');
                                                            setPage(1);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                                                            reviewFilter === 'shared'
                                                                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                                : 'text-[#8B948F] hover:bg-[#1F2923] hover:text-[#F5F7F5]'
                                                        }`}
                                                    >
                                                        <span>Shared Reviews</span>
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E]">
                                                            {sharedReviewsCount}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Custom Styled Sort Dropdown */}
                                    <div className="relative" ref={sortDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                                            className="flex items-center gap-1.5 bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-[#F5F7F5] text-[11px] sm:text-sm font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition shadow-sm"
                                        >
                                            <span>
                                                {sortBy === 'latest_review' && 'Latest Review'}
                                                {sortBy === 'title_asc' && 'Alphabet (A - Z)'}
                                                {sortBy === 'title_desc' && 'Alphabet (Z - A)'}
                                                {sortBy === 'rating_desc' && 'Rating (Highest)'}
                                                {sortBy === 'rating_asc' && 'Rating (Lowest)'}
                                                {sortBy === 'date_desc' && 'Release Date (Newest)'}
                                                {sortBy === 'date_asc' && 'Release Date (Oldest)'}
                                            </span>
                                            <svg
                                                className={`w-3.5 h-3.5 text-[#8B948F] transition-transform duration-200 ${
                                                    isSortDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isSortDropdownOpen && (
                                            <div className="absolute right-0 mt-1.5 w-52 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl py-1.5 z-20 overflow-hidden">
                                                <div className="px-3 py-1.5 text-[11px] font-bold text-[#8B948F] uppercase tracking-wider border-b border-[#1F2923]">
                                                    Sort Reviews By
                                                </div>
                                                {[
                                                    { id: 'rating_desc', label: 'Rating (Highest)' },
                                                    { id: 'rating_asc', label: 'Rating (Lowest)' },
                                                    { id: 'title_asc', label: 'Alphabet (A - Z)' },
                                                    { id: 'title_desc', label: 'Alphabet (Z - A)' },
                                                    { id: 'date_desc', label: 'Release Date (Newest)' },
                                                    { id: 'date_asc', label: 'Release Date (Oldest)' },
                                                    { id: 'latest_review', label: 'Latest Review' },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSortBy(opt.id);
                                                            setPage(1);
                                                            setIsSortDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                                                            sortBy === opt.id
                                                                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                                                : 'text-[#8B948F] hover:bg-[#1F2923] hover:text-[#F5F7F5]'
                                                        }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        {sortBy === opt.id && (
                                                            <span className="text-[#22C55E] font-bold">✓</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search reviews..."
                                className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-3.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            />
                        </div>

                        {paginated.length === 0 ? (
                            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-8 sm:p-12 text-center">
                                <p className="text-[#8B948F] text-sm">
                                    {reviews.length === 0 ? 'No reviews yet.' : `No reviews match "${search}".`}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile List View (< sm) */}
                                <div className="space-y-3 sm:hidden">
                                    {paginated.map((review) => (
                                        <div
                                            key={review.id}
                                            onClick={() => setSelectedReview(review)}
                                            className="cursor-pointer bg-[#131916] border border-[#1F2923] rounded-xl p-2.5 flex items-center gap-2.5 hover:border-[#2E3A32] transition"
                                        >
                                            <img
                                                src={review.game.cover_url}
                                                alt={review.game.title}
                                                onError={(e) => {
                                                    e.target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                                        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#131916"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#22C55E" font-family="sans-serif" font-size="14" font-weight="bold">${review.game.title.replace(/&/g, '&amp;')}</text></svg>`
                                                    )}`;
                                                }}
                                                className="w-14 h-14 rounded-lg object-cover shrink-0"
                                            />

                                            <div className="flex-1 min-w-0 pr-1">
                                                <h3 className="text-[#F5F7F5] text-xs font-semibold truncate leading-snug">
                                                    {review.game.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[#22C55E] text-xs font-bold">
                                                        ★ {Number(review.rating).toFixed(1)}
                                                    </span>
                                                    <span className="text-[#5A625D] text-[11px]">
                                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Buttons placed on the right side: 2 rows 1 column */}
                                            <div className="flex flex-col gap-1.5 shrink-0 w-20">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openTrailer(review.game.title);
                                                    }}
                                                    className="w-full rounded-md bg-[#1F2923] text-[#8B948F] text-[10px] font-medium py-1 hover:bg-[#2E3A32] hover:text-[#F5F7F5] transition text-center"
                                                >
                                                    Trailer
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleList(review.game.id, review.game.slug);
                                                    }}
                                                    className={`w-full rounded-md text-[10px] font-medium py-1 transition text-center ${listIds.includes(review.game.id)
                                                        ? 'bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D]'
                                                        : 'bg-[#1F2923] text-[#8B948F] hover:bg-[#2E3A32] hover:text-[#F5F7F5]'
                                                        }`}
                                                >
                                                    {listIds.includes(review.game.id) ? '✓ In List' : '+ My List'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Grid View (>= sm) */}
                                <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
                                    {paginated.map((review) => (
                                        <div key={review.id} className="relative">
                                            <div
                                                onClick={() => setSelectedReview(review)}
                                                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-[#0B0F0D]/85 backdrop-blur-sm text-[#22C55E] text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md cursor-pointer hover:bg-[#0B0F0D] transition shadow"
                                            >
                                                ★ {Number(review.rating).toFixed(1)}
                                            </div>
                                            <GameCard
                                                game={review.game}
                                                isInList={listIds.includes(review.game.id)}
                                                onToggleList={toggleList}
                                                hideRawgRating={true}
                                                onCardClick={() => setSelectedReview(review)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Responsive Pagination */}
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                            className="mt-6"
                        />
                    </>
                )}
            </div>

            {/* Review detail modal */}
            {selectedReview && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto custom-scrollbar"
                    onClick={() => setSelectedReview(null)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-2xl overflow-hidden max-w-md w-full shadow-2xl max-h-[85vh] flex flex-col my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-40 sm:h-48 shrink-0 bg-[#0B0F0D]">
                            <img
                                src={selectedReview.game.cover_url}
                                alt={selectedReview.game.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center text-xs font-bold hover:bg-black transition"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-5 sm:p-6 flex flex-col flex-1 min-h-0">
                            <h3 className="text-[#F5F7F5] text-base sm:text-lg font-bold mb-1 line-clamp-1">
                                {selectedReview.game.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-3 shrink-0">
                                <span className="text-[#22C55E] text-2xl font-black">
                                    {Number(selectedReview.rating).toFixed(1)}
                                </span>
                                <span className="text-[#5A625D] text-xs font-semibold">/ 10</span>
                                <span className="text-[#22C55E] text-lg">★</span>
                            </div>
                            {selectedReview.body && (
                                <div className="max-h-[160px] sm:max-h-[200px] overflow-y-auto custom-scrollbar pr-2 mb-5 text-[#8B948F] text-xs sm:text-sm leading-relaxed">
                                    <p>{selectedReview.body}</p>
                                </div>
                            )}

                            <div className="flex gap-2.5 mt-auto pt-2 border-t border-[#1F2923] shrink-0">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="flex-1 rounded-xl border border-[#1F2923] text-[#8B948F] py-2.5 text-xs sm:text-sm font-semibold hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => goToGame(selectedReview.game.slug)}
                                    style={{ backgroundColor: '#22C55E', color: '#0B0F0D' }}
                                    className="flex-1 rounded-xl font-bold py-2.5 text-xs sm:text-sm hover:bg-[#16A34A] transition shadow-md"
                                >
                                    View Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Profile Avatar Pure Image Modal Preview */}
            <Modal show={showAvatarModal} onClose={() => setShowAvatarModal(false)} maxWidth="md">
                <div
                    onClick={() => setShowAvatarModal(false)}
                    className="p-2 sm:p-3 bg-[#131916] border border-[#1F2923] rounded-2xl flex items-center justify-center cursor-pointer"
                >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl bg-[#0B0F0D] flex items-center justify-center border border-[#1F2923]">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={profileUser.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                        e.target.nextSibling.style.display = 'block';
                                    }
                                }}
                            />
                        ) : null}
                        <span style={{ display: avatarUrl ? 'none' : 'block' }} className="text-[#22C55E] text-6xl font-bold">
                            {initials || '?'}
                        </span>
                    </div>
                </div>
            </Modal>

            {/* Header Unfollow Confirmation Modal in English */}
            {showUnfollowConfirm && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] px-4"
                    onClick={() => setShowUnfollowConfirm(false)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 max-w-sm w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[#F5F7F5] text-base font-semibold mb-2">
                            Unfollow {profileUser.name}?
                        </h3>
                        <p className="text-[#8B948F] text-xs leading-relaxed mb-6">
                            Are you sure you want to unfollow <span className="text-[#F5F7F5] font-medium">{profileUser.name}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowUnfollowConfirm(false)}
                                className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-xs font-medium hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUnfollowHeader}
                                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                                className="rounded-lg font-semibold px-4 py-2 text-xs hover:opacity-90 transition"
                            >
                                Unfollow
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Story Viewer Modal */}
            <StoryViewerModal
                show={showStoryViewer}
                stories={userStories}
                initialIndex={0}
                onClose={() => setShowStoryViewer(false)}
                onStoryViewed={handleStoryViewed}
            />

            {/* Highlight Story Viewer Modal */}
            <StoryViewerModal
                show={showHighlightViewer}
                stories={highlightViewerStories}
                initialIndex={0}
                onClose={() => setShowHighlightViewer(false)}
            />

            {/* Rank Info Modal */}
            <RankInfoModal
                show={showRankModal}
                onClose={() => setShowRankModal(false)}
                reviewCount={reviews ? reviews.length : 0}
            />
        </AppLayout>
    );
}