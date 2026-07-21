import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Register({ interests }) {
    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        interests: [],
        avatar: null,
    });

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

    const goToStep2 = (e) => {
        e.preventDefault();
        if (!data.name || !data.email || !data.password || !data.password_confirmation) {
            return;
        }
        setStep(2);
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
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            placeholder="you@example.com"
                        />
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
                        {errors.password_confirmation && (
                            <p className="mt-1.5 text-sm text-red-400">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition"
                    >
                        Continue
                    </button>

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
                            className="flex-1 rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50"
                        >
                            Create account
                        </button>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}