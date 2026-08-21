import { Head, Link } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function Blog() {
    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#F5F7F5] flex flex-col">
            <Head title="404 - Page Not Found" />

            <PublicNavbar currentRoute="blog" />

            <main className="flex-1 flex flex-col items-center justify-center max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 text-center py-16">
                <span className="text-7xl sm:text-9xl font-black text-[#22C55E]/20 tracking-widest mb-2 select-none">
                    404
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-[#F5F7F5] mb-3">
                    Page Not Found
                </h1>
                <p className="text-[#8B948F] text-sm sm:text-base max-w-md mb-8">
                    The blog page you are looking for is currently unavailable or under construction.
                </p>
                <Link
                    href={route('welcome')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] text-[#0B0F0D] px-6 py-2.5 text-sm font-semibold hover:bg-[#4ADE80] transition shadow-lg shadow-[#22C55E]/20"
                >
                    Back to Home
                </Link>
            </main>
        </div>
    );
}
