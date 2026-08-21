import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PublicNavbar({ currentRoute = 'welcome', variant = 'dark' }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isLight = variant === 'light';

    const navLinks = [
        { name: 'Home', href: route('welcome'), id: 'welcome' },
        { name: 'About Us', href: route('about'), id: 'about' },
        { name: 'Community', href: route('reviews.index'), id: 'reviews.index' },
        { name: 'News', href: route('blog'), id: 'blog' },
    ];

    return (
        <nav
            className={`sticky top-0 z-40 backdrop-blur-md transition-colors ${
                isLight
                    ? 'bg-white/90 border-b border-slate-200'
                    : 'bg-[#0B0F0D]/90 border-b border-[#1F2923]'
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
                {/* Left side: Logo */}
                <Link href={route('welcome')} className="flex items-center group">
                    <span
                        className={`font-bold text-xl tracking-tight transition ${
                            isLight
                                ? 'text-slate-900 group-hover:text-[#16A34A]'
                                : 'text-[#F5F7F5] group-hover:text-[#22C55E]'
                        }`}
                    >
                        Playscore
                    </span>
                </Link>

                {/* Right side: Nav Links & Mobile Menu Toggle */}
                <div className="flex items-center">
                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium">
                        {navLinks.map((link) => {
                            const isActive = currentRoute === link.id;
                            const textColor = isLight
                                ? isActive
                                    ? 'text-[#16A34A] font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                : isActive
                                ? 'text-[#22C55E] font-semibold'
                                : 'text-[#8B948F] hover:text-[#F5F7F5]';

                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`transition-colors relative py-1 ${textColor}`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${
                                                isLight ? 'bg-[#16A34A]' : 'bg-[#22C55E]'
                                            }`}
                                        />
                                    )}
                                </a>
                            );
                        })}

                        {/* Join with Us Button (Darkens on Hover) */}
                        <Link
                            href={route('login')}
                            className="px-4 py-2 rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold text-xs hover:bg-[#16A34A] hover:text-white transition shadow-md shadow-[#22C55E]/20"
                        >
                            Join with Us
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden ml-4 p-2 rounded-md transition ${
                            isLight
                                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#161F1A]'
                        }`}
                        aria-label="Toggle navigation menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile navigation dropdown */}
            {mobileMenuOpen && (
                <div
                    className={`md:hidden border-t px-6 py-4 space-y-3 ${
                        isLight
                            ? 'border-slate-200 bg-white'
                            : 'border-[#1F2923] bg-[#0B0F0D]'
                    }`}
                >
                    {navLinks.map((link) => {
                        const isActive = currentRoute === link.id;
                        const textColor = isLight
                            ? isActive
                                ? 'text-[#16A34A] font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                            : isActive
                            ? 'text-[#22C55E] font-semibold'
                            : 'text-[#8B948F] hover:text-[#F5F7F5]';

                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block text-sm font-medium transition ${textColor}`}
                            >
                                {link.name}
                            </a>
                        );
                    })}

                    <Link
                        href={route('login')}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold text-xs hover:bg-[#16A34A] hover:text-white transition shadow-md shadow-[#22C55E]/20 mt-2"
                    >
                        Join with Us
                    </Link>
                </div>
            )}
        </nav>
    );
}
