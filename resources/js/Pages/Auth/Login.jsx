import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingDots from '@/Components/LoadingDots';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
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

            <form onSubmit={submit} className="space-y-5" autoComplete="off">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm text-[#8B948F] mb-1.5"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        autoComplete="off"
                        data-lpignore="true"
                        autoFocus
                        onChange={(e) => setData('username', e.target.value)}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        placeholder="Enter your username"
                    />
                    {errors.username && (
                        <p className="mt-1.5 text-sm text-red-400">{errors.username}</p>
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
                        autoComplete="new-password"
                        data-lpignore="true"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        placeholder="Enter your password"
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
                    className="w-full rounded-lg bg-[#22C55E] text-[#0B0F0D] font-medium py-2.5 text-sm hover:bg-[#4ADE80] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {processing ? (
                        <LoadingDots text="Signing in" />
                    ) : (
                        <span>Sign in</span>
                    )}
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
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-[#22C55E] hover:text-[#4ADE80]">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}