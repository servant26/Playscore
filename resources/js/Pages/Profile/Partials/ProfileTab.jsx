import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef, useState } from 'react';

export default function ProfileTab({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const avatarInputRef = useRef();
    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        router.post(
            route('profile.update'),
            {
                _method: 'patch',
                name: data.name,
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
        <div className="space-y-8 max-w-2xl">
            {/* Profile Info + Avatar */}
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
                            onClick={() => avatarInputRef.current?.click()}
                            className="relative w-16 h-16 rounded-full overflow-hidden bg-[#0B0F0D] border-2 border-dashed border-[#1F2923] flex items-center justify-center hover:border-[#22C55E] transition shrink-0"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={data.name}
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
                            className="text-sm text-[#22C55E] hover:text-[#4ADE80]"
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
                            className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
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
                            className="rounded-lg font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                        >
                            Save
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

            {/* Password */}
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
                        <input
                            ref={currentPasswordInput}
                            type="password"
                            value={pwData.current_password}
                            onChange={(e) => setPwData('current_password', e.target.value)}
                            className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        />
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
                        <input
                            ref={passwordInput}
                            type="password"
                            value={pwData.password}
                            onChange={(e) => setPwData('password', e.target.value)}
                            className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        />
                        {pwErrors.password && (
                            <p className="mt-1.5 text-sm text-red-400">{pwErrors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-[#8B948F] mb-1.5">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            value={pwData.password_confirmation}
                            onChange={(e) =>
                                setPwData('password_confirmation', e.target.value)
                            }
                            className="w-full rounded-lg bg-[#0B0F0D] border border-[#1F2923] text-[#F5F7F5] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        />
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
                            className="rounded-lg font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                        >
                            Save
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

            {/* Delete Account */}
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
        </div>
    );
}