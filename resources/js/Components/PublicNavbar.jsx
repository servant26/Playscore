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
            <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between transition-all duration-200">
                {/* Left side: Logo */}
                <Link href={route('welcome')} className="flex items-center group">
                    <span
                        className={`font-bold text-xl sm:text-2xl tracking-tight transition ${
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
                    <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-base font-medium">
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
                                    className={`transition-colors relative py-2 ${textColor}`}
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
                            className="px-5 py-2.5 rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold text-xs sm:text-sm hover:bg-[#16A34A] hover:text-white transition-all duration-200 shadow-md shadow-[#22C55E]/20 active:scale-95"
                        >
                            Join with Us
                        </Link>
                    </div>

                    {/* Mobile menu button with smooth icon morph */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden ml-4 p-2.5 rounded-xl transition-all duration-200 focus:outline-none ${
                            isLight
                                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
                                : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#161F1A] active:scale-95'
                        }`}
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5 relative">
                            <span
                                className={`h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                                    isLight ? 'bg-slate-800' : 'bg-[#F5F7F5]'
                                } ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                            />
                            <span
                                className={`h-0.5 w-5 rounded-full transition-all duration-200 ease-in-out ${
                                    isLight ? 'bg-slate-800' : 'bg-[#F5F7F5]'
                                } ${mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`}
                            />
                            <span
                                className={`h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                                    isLight ? 'bg-slate-800' : 'bg-[#F5F7F5]'
                                } ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Backdrop Overlay (Smooth dimming effect) */}
            <div
                onClick={() => setMobileMenuOpen(false)}
                className={`fixed inset-x-0 top-16 sm:top-20 bottom-0 z-30 transition-opacity duration-300 md:hidden ${
                    mobileMenuOpen
                        ? 'opacity-100 pointer-events-auto bg-black/50 backdrop-blur-sm'
                        : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
            />

            {/* Mobile Navigation Drawer (Smooth Slide-down & Fade Overlay) */}
            <div
                className={`absolute top-full left-0 right-0 z-40 md:hidden border-b transition-all duration-300 ease-out origin-top ${
                    isLight
                        ? 'bg-white/95 border-slate-200 shadow-xl'
                        : 'bg-[#0B0F0D]/95 border-[#1F2923] shadow-2xl shadow-black/60'
                } backdrop-blur-xl ${
                    mobileMenuOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                        : 'opacity-0 -translate-y-4 pointer-events-none invisible'
                }`}
            >
                <div className="max-w-[1440px] mx-auto px-6 py-5 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = currentRoute === link.id;
                        const linkStyle = isLight
                            ? isActive
                                ? 'bg-[#22C55E]/10 text-[#16A34A] font-semibold'
                                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                            : isActive
                            ? 'bg-[#16291E]/70 text-[#22C55E] font-semibold'
                            : 'text-[#8B948F] hover:text-[#F5F7F5] hover:bg-[#121915]';

                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${linkStyle}`}
                            >
                                <span>{link.name}</span>
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                                )}
                            </a>
                        );
                    })}

                    <div className="pt-3 border-t border-[#1F2923]/60">
                        <Link
                            href={route('login')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold text-sm hover:bg-[#16A34A] hover:text-white transition-all duration-200 shadow-lg shadow-[#22C55E]/20 active:scale-[0.98]"
                        >
                            Join with Us
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
