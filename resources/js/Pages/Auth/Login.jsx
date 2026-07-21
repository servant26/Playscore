import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to continue rating and reviewing games."
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 text-sm text-[#22C55E] bg-[#132015] border border-[#1F3D26] rounded-lg px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm text-[#8B948F] mb-1.5"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm text-[#8B948F] mb-1.5"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-[#1F2923] bg-[#131916] text-[#22C55E] focus:ring-[#22C55E] focus:ring-offset-0"
                        />
                        <span className="text-sm text-[#8B948F]">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-[#22C55E] hover:text-[#4ADE80]"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sign in
                </button>

                <p className="text-center text-sm text-[#8B948F]">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-[#22C55E] hover:text-[#4ADE80]">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}