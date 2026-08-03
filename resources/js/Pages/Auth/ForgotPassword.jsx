import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="No problem. Enter your email and we'll send you a reset link."
        >
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-6 text-sm text-[#22C55E] bg-[#132015] border border-[#1F3D26] rounded-lg px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm text-[#8B948F] mb-1.5">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50"
                >
                    {processing ? 'Sending...' : 'Email Password Reset Link'}
                </button>

                <p className="text-center text-sm text-[#8B948F]">
                    Remember your password?{' '}
                    <Link href={route('login')} className="text-[#22C55E] hover:text-[#4ADE80]">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}