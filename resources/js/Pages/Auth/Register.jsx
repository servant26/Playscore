import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingDots from '@/Components/LoadingDots';
import { useState, useRef } from 'react';

export default function Register({ interests }) {
    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [emailTaken, setEmailTaken] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        interests: [],
        avatar: null,
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = data.email === '' || emailPattern.test(data.email);
    const passwordsMatch =
        data.password_confirmation === '' || data.password === data.password_confirmation;
    const isPasswordLongEnough = data.password === '' || data.password.length >= 8;

    const canContinueStep1 =
        data.name.trim() !== '' &&
        data.email.trim() !== '' &&
        emailPattern.test(data.email) &&
        data.password !== '' &&
        data.password.length >= 8 &&
        data.password_confirmation !== '' &&
        data.password === data.password_confirmation;

    const toggleInterest = (id) => {
        setData(
            'interests',
            data.interests.includes(id)
                ? data.interests.filter((i) => i !== id)
                : [...data.interests, id]
        );
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const goToStep2 = async (e) => {
        e.preventDefault();
        if (!canContinueStep1) {
            return;
        }

        setCheckingEmail(true);
        setEmailTaken(false);

        try {
            const response = await fetch('/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ email: data.email }),
            });
            const result = await response.json();

            // Backend returns { available: true } if email is free, { available: false } if taken
            if (result.available === false) {
                setEmailTaken(true);
                setCheckingEmail(false);
                return;
            }

            setCheckingEmail(false);
            setStep(2);
        } catch (error) {
            // On error (e.g. rate limited), still allow proceeding — server will catch duplicate on submit
            setCheckingEmail(false);
            setStep(2);
        }
    };


    const goToStep3 = () => setStep(3);
    const backStep = () => setStep((s) => s - 1);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const initials = data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <AuthLayout
            title={
                step === 1
                    ? 'Create your account'
                    : step === 2
                        ? 'Choose your interests'
                        : 'Set up your profile'
            }
            subtitle={
                step === 1
                    ? 'Start tracking and reviewing the games you play.'
                    : step === 2
                        ? "Pick genres you're into. You can change these later."
                        : 'Add a name and photo so others recognize you.'
            }
        >
            <Head title="Register" />

            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition ${s <= step ? 'bg-[#22C55E]' : 'bg-[#1F2923]'
                            }`}
                    />
                ))}
            </div>

            {step === 1 && (
                <form onSubmit={goToStep2} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm text-[#8B948F] mb-1.5">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            placeholder="Ali Khatami"
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm text-[#8B948F] mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                setEmailTaken(false);
                            }}
                            className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            placeholder="you@example.com"
                        />
                        {!isEmailValid && (
                            <p className="mt-1.5 text-sm text-red-400">
                                Please enter a valid email address.
                            </p>
                        )}
                        {emailTaken && (
                            <p className="mt-1.5 text-sm text-red-400">
                                This email is already registered.
                            </p>
                        )}
                        {errors.email && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-[#8B948F] mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            placeholder="••••••••"
                        />
                        {!isPasswordLongEnough && (
                            <p className="mt-1.5 text-sm text-red-400">
                                Password must be at least 8 characters.
                            </p>
                        )}
                        {errors.password && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm text-[#8B948F] mb-1.5"
                        >
                            Confirm password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            placeholder="••••••••"
                        />
                        {!passwordsMatch && (
                            <p className="mt-1.5 text-sm text-red-400">
                                Passwords do not match.
                            </p>
                        )}
                        {errors.password_confirmation && (
                            <p className="mt-1.5 text-sm text-red-400">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!canContinueStep1 || checkingEmail}
                        className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#22C55E]"
                    >
                        {checkingEmail ? 'Checking...' : 'Continue'}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#1F2923]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0D120F] px-2 text-[#5A625D]">or continue with</span>
                        </div>
                    </div>

                    <a
                        href={route('auth.google')}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] hover:border-[#2E3D35] hover:bg-[#1A231F] text-[#F5F7F5] font-medium py-2.5 text-sm transition flex items-center justify-center gap-2.5"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Google</span>
                    </a>

                    <p className="text-center text-sm text-[#8B948F]">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-[#22C55E] hover:text-[#4ADE80]">
                            Sign in
                        </Link>
                    </p>
                </form>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => {
                            const active = data.interests.includes(interest.id);
                            return (
                                <button
                                    key={interest.id}
                                    type="button"
                                    onClick={() => toggleInterest(interest.id)}
                                    className={`px-4 py-2 rounded-full text-sm border transition ${active
                                        ? 'bg-[#22C55E] border-[#22C55E] text-[#0B0F0D] font-medium'
                                        : 'bg-[#131916] border-[#1F2923] text-[#8B948F] hover:border-[#2E3A32]'
                                        }`}
                                >
                                    {interest.name}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={backStep}
                            className="flex-1 rounded-lg border border-[#1F2923] text-[#8B948F] font-medium py-2.5 text-sm hover:border-[#2E3A32] transition"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={goToStep3}
                            className="flex-1 rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-24 h-24 rounded-full overflow-hidden bg-[#131916] border-2 border-dashed border-[#1F2923] flex items-center justify-center hover:border-[#22C55E] transition"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-[#22C55E] text-2xl font-semibold">
                                    {initials || '?'}
                                </span>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 text-sm text-[#22C55E] hover:text-[#4ADE80]"
                        >
                            {avatarPreview ? 'Change photo' : 'Upload photo'}
                        </button>
                        {errors.avatar && (
                            <p className="mt-1.5 text-sm text-red-400">{errors.avatar}</p>
                        )}
                        <p className="mt-1 text-xs text-[#5A625D]">
                            Optional — we'll use your initials if you skip this.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={backStep}
                            className="flex-1 rounded-lg border border-[#1F2923] text-[#8B948F] font-medium py-2.5 text-sm hover:border-[#2E3A32] transition"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {processing ? (
                                <LoadingDots text="Creating account" />
                            ) : (
                                <span>Create account</span>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}