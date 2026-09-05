import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingDots from '@/Components/LoadingDots';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your username to submit a password reset request to the Admin."
        >
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-6 text-sm text-[#22C55E] bg-[#132015] border border-[#1F3D26] rounded-lg px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="username" className="block text-sm text-[#8B948F] mb-1.5">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={data.username}
                        autoFocus
                        onChange={(e) => setData('username', e.target.value)}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        placeholder="Enter your registered username"
                    />
                    {errors.username && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.username}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {processing ? (
                        <LoadingDots text="Submitting request" />
                    ) : (
                        <span>Submit Reset Request to Admin</span>
                    )}
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