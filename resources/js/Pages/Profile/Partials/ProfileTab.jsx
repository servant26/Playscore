import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import FollowListModal from '@/Components/FollowListModal';
import GameCard from '@/Components/GameCard';
import RankInfoModal from '@/Components/RankInfoModal';
import UserRankCard from '@/Components/UserRankCard';
import { getRankInfo } from '@/Utils/rankSystem';
import LoadingDots from '@/Components/LoadingDots';

import HighlightSection from '@/Components/HighlightSection';

export default function ProfileTab({
    mustVerifyEmail,
    status,
    followersCount = 0,
    followingCount = 0,
    allInterests = [],
    userInterestIds = [],
    recommendations = [],
    listIds = [],
    pendingChanges = {},
    onToggleList,
    onSave,
    onDiscard,
    myReviews = [],
    adminSubTab = null,
    highlights = [],
    myStories = [],
    myArchivedStories = [],
    onSelectHighlight,
}) {
    const user = usePage().props.auth.user;
    const avatarInputRef = useRef();
    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
            return avatar;
        }
        return `/storage/${avatar}`;
    };

    const [avatarPreview, setAvatarPreview] = useState(getAvatarUrl(user.avatar));
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showFollowModal, setShowFollowModal] = useState({ show: false, type: 'followers' });
    const [showRankModal, setShowRankModal] = useState(false);

    const reviewCount = myReviews ? myReviews.length : 0;
    const { count, currentRank, nextRank, progress, isMax, reviewsNeeded } = getRankInfo(reviewCount);

    // Password visibility state toggles
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    // Interest state & functions
    const [selectedIds, setSelectedIds] = useState(userInterestIds || []);
    const [savingInterests, setSavingInterests] = useState(false);

    const toggleInterest = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const saveInterests = () => {
        setSavingInterests(true);
        router.post(
            route('interests.update'),
            { interests: selectedIds },
            {
                preserveScroll: true,
                onFinish: () => setSavingInterests(false),
            }
        );
    };

    const hasInterestChanges =
        JSON.stringify([...selectedIds].sort()) !==
        JSON.stringify([...(userInterestIds || [])].sort());

    const hasPendingListChanges = Object.keys(pendingChanges || {}).length > 0;

    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: user.name,
        username: user.username || '',
        email: user.email || '',
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        router.post(
            route('profile.update'),
            {
                _method: 'patch',
                name: data.name,
                username: data.username,
                email: data.email,
                avatar: data.avatar,
            },
            { forceFormData: true }
        );
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const initials = data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const {
        data: pwData,
        setData: setPwData,
        errors: pwErrors,
        put,
        reset: resetPw,
        processing: pwProcessing,
        recentlySuccessful: pwSuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPw(),
            onError: (errors) => {
                if (errors.password) {
                    resetPw('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    resetPw('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const deletePasswordInput = useRef();
    const {
        data: delData,
        setData: setDelData,
        delete: destroy,
        processing: delProcessing,
        reset: resetDel,
        errors: delErrors,
        clearErrors: clearDelErrors,
    } = useForm({ password: '' });

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
            onError: () => deletePasswordInput.current.focus(),
            onFinish: () => resetDel(),
        });
    };

    const closeDeleteModal = () => {
        setConfirmingDeletion(false);
        clearDelErrors();
        resetDel();
    };

    const saveButtonStyle = {
        minWidth: '140px',
        backgroundColor: '#22C55E',
        color: '#0B0F0D',
    };

    const deleteButtonStyle = {
        minWidth: '180px',
        backgroundColor: '#DC2626',
        color: '#FFFFFF',
    };

    return (
        <div className="space-y-6 w-full">
            {/* Story Highlights Section (Above Gamer Rank) */}
            {user.role !== 'admin' && (
                <div className="space-y-2">
                    <HighlightSection
                        highlights={highlights}
                        isOwner={true}
                        myStories={myStories}
                        myArchivedStories={myArchivedStories}
                        onSelectHighlight={onSelectHighlight}
                    />
                    <UserRankCard reviewCount={myReviews ? myReviews.length : 0} />
                </div>
            )}

            {/* Profile Info + Avatar */}
            {(!adminSubTab || adminSubTab === 'profile') && (
                <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-6">
                    <h2 className="text-[#F5F7F5] text-lg font-semibold mb-1">
                        Profile Information
                    </h2>
                    <p className="text-[#8B948F] text-sm mb-6">
                        Update your account's profile information and photo.
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowAvatarModal(true)}
                                className="relative w-16 h-16 rounded-full overflow-hidden bg-[#0B0F0D] border-2 border-solid border-[#1F2923] flex items-center justify-center hover:border-[#22C55E] transition shrink-0 cursor-pointer"
                                title="Click to view photo"
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={data.name}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-[#22C55E] text-lg font-semibold">
                                        {initials || '?'}
                                    </span>
                                )}
                            </button>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="text-sm text-[#22C55E] hover:text-[#4ADE80] font-medium"
                            >
                                Change photo
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm text-[#8B948F] mb-1.5">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-[#8B948F] mb-1.5">Username</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                placeholder="Enter your username"
                                className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            />
                            {errors.username && (
                                <p className="mt-1.5 text-sm text-red-400">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-[#8B948F] mb-1.5">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="text-sm text-[#8B948F]">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-[#22C55E] hover:text-[#4ADE80] underline"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm text-[#22C55E]">
                                        A new verification link has been sent.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                style={saveButtonStyle}
                                className="rounded-lg font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
                            >
                                {processing ? (
                                    <LoadingDots text="Saving" />
                                ) : (
                                    <span>Save</span>
                                )}
                            </button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-[#22C55E]">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                </section>
            )}

            {/* Your Interests Section */}
            {user.role !== 'admin' && allInterests && allInterests.length > 0 && (
                <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-6">
                    <h2 className="text-[#F5F7F5] text-lg font-semibold mb-1">Your Interests</h2>
                    <p className="text-[#8B948F] text-sm mb-5">
                        Pick genres you're into.
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 max-h-28 sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 custom-scrollbar">
                        {allInterests.map((interest) => {
                            const active = selectedIds.includes(interest.id);
                            return (
                                <button
                                    key={interest.id}
                                    type="button"
                                    onClick={() => toggleInterest(interest.id)}
                                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm border transition duration-200 ${active
                                        ? 'bg-[#22C55E] border-[#22C55E] text-[#0B0F0D] font-semibold shadow-[0_0_12px_rgba(34,197,94,0.35)] hover:bg-[#16A34A] hover:border-[#16A34A]'
                                        : 'bg-[#0B0F0D] border-[#1F2923] text-[#8B948F] hover:bg-[#131916] hover:border-[#22C55E] hover:text-[#22C55E]'
                                        }`}
                                >
                                    {interest.name}
                                </button>
                            );
                        })}
                    </div>

                    {hasInterestChanges && (
                        <button
                            onClick={saveInterests}
                            disabled={savingInterests}
                            style={{ backgroundColor: '#22C55E', color: '#0B0F0D', minWidth: '130px' }}
                            className="rounded-lg font-semibold py-2 text-xs sm:text-sm hover:opacity-90 transition disabled:opacity-50"
                        >
                            {savingInterests ? 'Saving...' : 'Save Interests'}
                        </button>
                    )}
                </section>
            )}

            {/* Password */}
            {(!adminSubTab || adminSubTab === 'password') && (
                <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-6">
                    <h2 className="text-[#F5F7F5] text-lg font-semibold mb-1">
                        Update Password
                    </h2>
                    <p className="text-[#8B948F] text-sm mb-6">
                        Ensure your account is using a long, random password to stay secure.
                    </p>

                    <form onSubmit={updatePassword} className="space-y-5">
                        <div>
                            <label className="block text-sm text-[#8B948F] mb-1.5">
                                Current password
                            </label>
                            <div className="relative">
                                <input
                                    ref={currentPasswordInput}
                                    type={showCurrentPw ? 'text' : 'password'}
                                    value={pwData.current_password}
                                    onChange={(e) => setPwData('current_password', e.target.value)}
                                    className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B948F] hover:text-[#F5F7F5] transition p-1"
                                    title={showCurrentPw ? 'Hide password' : 'Show password'}
                                >
                                    {showCurrentPw ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" y1="2" x2="22" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {pwErrors.current_password && (
                                <p className="mt-1.5 text-sm text-red-400">
                                    {pwErrors.current_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-[#8B948F] mb-1.5">
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    ref={passwordInput}
                                    type={showNewPw ? 'text' : 'password'}
                                    value={pwData.password}
                                    onChange={(e) => setPwData('password', e.target.value)}
                                    className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPw(!showNewPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B948F] hover:text-[#F5F7F5] transition p-1"
                                    title={showNewPw ? 'Hide password' : 'Show password'}
                                >
                                    {showNewPw ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" y1="2" x2="22" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {pwErrors.password && (
                                <p className="mt-1.5 text-sm text-red-400">{pwErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-[#8B948F] mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPw ? 'text' : 'password'}
                                    value={pwData.password_confirmation}
                                    onChange={(e) =>
                                        setPwData('password_confirmation', e.target.value)
                                    }
                                    className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B948F] hover:text-[#F5F7F5] transition p-1"
                                    title={showConfirmPw ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPw ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" y1="2" x2="22" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {pwErrors.password_confirmation && (
                                <p className="mt-1.5 text-sm text-red-400">
                                    {pwErrors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={pwProcessing}
                                style={saveButtonStyle}
                                className="rounded-lg font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
                            >
                                {pwProcessing ? (
                                    <LoadingDots text="Saving" />
                                ) : (
                                    <span>Save</span>
                                )}
                            </button>
                            <Transition
                                show={pwSuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-[#22C55E]">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                </section>
            )}

            {/* Delete Account */}
            {(!adminSubTab || adminSubTab === 'danger') && (
                <section className="bg-[#131916] border border-red-900/40 rounded-xl p-6">
                    <h2 className="text-[#F5F7F5] text-lg font-semibold mb-1">
                        Delete Account
                    </h2>
                    <p className="text-[#8B948F] text-sm mb-6">
                        Once your account is deleted, all of its resources and data will be
                        permanently deleted.
                    </p>

                    <button
                        onClick={() => setConfirmingDeletion(true)}
                        style={deleteButtonStyle}
                        className="rounded-lg font-medium py-2 text-sm hover:opacity-90 transition"
                    >
                        Delete Account
                    </button>

                    {confirmingDeletion && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 max-w-md w-full">
                                <h3 className="text-[#F5F7F5] text-lg font-semibold mb-2">
                                    Are you sure you want to delete your account?
                                </h3>
                                <p className="text-[#8B948F] text-sm mb-4">
                                    This action cannot be undone. Please enter your password to
                                    confirm.
                                </p>
                                <form onSubmit={deleteUser}>
                                    <input
                                        ref={deletePasswordInput}
                                        type="password"
                                        value={delData.password}
                                        onChange={(e) => setDelData('password', e.target.value)}
                                        placeholder="Password"
                                        className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                                    />
                                    {delErrors.password && (
                                        <p className="text-sm text-red-400 mb-4">
                                            {delErrors.password}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={closeDeleteModal}
                                            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-sm hover:border-[#2E3A32] transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={delProcessing}
                                            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                                            className="rounded-lg font-medium px-6 py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Profile Avatar Pure Image Modal Preview */}
            <Modal show={showAvatarModal} onClose={() => setShowAvatarModal(false)} maxWidth="md">
                <div
                    onClick={() => setShowAvatarModal(false)}
                    className="p-2 sm:p-3 bg-[#131916] border border-[#1F2923] rounded-2xl flex items-center justify-center cursor-pointer"
                >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl bg-[#0B0F0D] flex items-center justify-center border border-[#1F2923]">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt={data.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-[#22C55E] text-6xl font-bold">
                                {initials || '?'}
                            </span>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Followers / Following List Modal */}
            <FollowListModal
                show={showFollowModal.show}
                type={showFollowModal.type}
                user={user}
                onClose={() => setShowFollowModal({ show: false, type: 'followers' })}
            />

            {/* Rank Info Modal */}
            <RankInfoModal
                show={showRankModal}
                onClose={() => setShowRankModal(false)}
                reviewCount={reviewCount}
            />
        </div>
    );
}