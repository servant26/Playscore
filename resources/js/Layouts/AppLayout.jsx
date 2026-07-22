import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const { auth, url } = usePage().props;
    const currentUrl = usePage().url;
    const [search, setSearch] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const isHomeOrSearch = currentUrl.startsWith('/dashboard') || currentUrl.startsWith('/search');

    const submitSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.get(route('search'), { q: search });
        } else {
            router.get(route('dashboard'));
        }
    };

    const initials = auth.user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen bg-[#0B0F0D]">
            <nav className="sticky top-0 z-40 bg-[#0F1512] border-b border-[#1F2923]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
                    <Link href={route('dashboard')} className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                            <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                        </div>
                        <span className="text-[#F5F7F5] font-semibold text-lg hidden sm:block">
                            Playscore
                        </span>
                    </Link>

                    {isHomeOrSearch && (
                        <form onSubmit={submitSearch} className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games..."
                                className="w-full rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            />
                        </form>
                    )}

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="relative text-[#8B948F] hover:text-[#F5F7F5] transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                        </button>

                        <div className="relative flex items-center gap-3">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-4"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#131916] border border-[#1F2923] flex items-center justify-center text-[#22C55E] text-sm font-semibold overflow-hidden">
                                    {auth.user.avatar ? (
                                        <img
                                            src={`/storage/${auth.user.avatar}`}
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <span className="text-[#F5F7F5] text-sm font-medium hidden sm:block">
                                    {auth.user.name}
                                </span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 top-12 w-48 bg-[#131916] border border-[#1F2923] rounded-lg shadow-lg py-1 z-50">
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-4 py-2 text-sm text-[#F5F7F5] hover:bg-[#1F2923]"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 text-sm text-[#F5F7F5] hover:bg-[#1F2923]"
                                    >
                                        Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </div>
    );
}