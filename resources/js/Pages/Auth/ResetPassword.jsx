import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Choose a new password to secure your account."
        >
            <Head title="Reset Password" />

            <form onSubmit={submit} className="space-y-5">
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
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm text-[#8B948F] mb-1.5">
                        New password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        autoFocus
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
                        Confirm new password
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
                    disabled={processing}
                    className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50"
                >
                    {processing ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </AuthLayout>
    );
}