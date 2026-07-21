import { Link } from '@inertiajs/react';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="flex min-h-screen bg-[#0B0F0D]">
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-[#0F1512] border-r border-[#1F2923] p-12">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                        <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                    </div>
                    <span className="text-[#F5F7F5] font-semibold text-lg tracking-tight">
                        Playscore
                    </span>
                </Link>

                <div>
                    <h2 className="text-[#F5F7F5] text-3xl font-semibold leading-tight mb-4">
                        Rate it. Review it.<br />Remember it.
                    </h2>
                    <p className="text-[#8B948F] text-base leading-relaxed max-w-sm">
                        Track every game you play, share honest reviews, and
                        discover what to play next based on what you actually like.
                    </p>
                </div>

                <p className="text-[#5A625D] text-sm">
                    © {new Date().getFullYear()} Playscore. All rights reserved.
                </p>
            </div>

            <div className="flex flex-1 items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                            <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                        </div>
                        <span className="text-[#F5F7F5] font-semibold text-lg">
                            Playscore
                        </span>
                    </div>

                    <h1 className="text-[#F5F7F5] text-2xl font-semibold mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[#8B948F] text-sm mb-8">{subtitle}</p>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}