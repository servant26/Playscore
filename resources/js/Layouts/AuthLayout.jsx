import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const ALL_IMAGES = [
    'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg',
    'https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg',
    'https://media.rawg.io/media/games/bc0/bc06a29ceac58652b684deefe7d56099.jpg',
    'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg',
    'https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg',
    'https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg',
    'https://media.rawg.io/media/games/942/9424d6bb763dc38d9378b488603c87fa.jpg',
    'https://media.rawg.io/media/games/73e/73eecb8909e0c39fb246f457b5d6cbbe.jpg',
    'https://media.rawg.io/media/games/46d/46d98e6910fbc0706e2948a7cc9b10c5.jpg',
];

function pickRandomImages(pool, count) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export default function AuthLayout({ children, title, subtitle }) {
    const [slideImages] = useState(() => pickRandomImages(ALL_IMAGES, 4));
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#0B0F0D]">
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between relative overflow-hidden border-r border-[#1F2923] p-12">
                {slideImages.map((img, i) => (
                    <div
                        key={img}
                        className="absolute inset-0 transition-opacity duration-1000"
                        style={{
                            opacity: i === activeSlide ? 1 : 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(3px)',
                            transform: 'scale(1.1)',
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-[#0B0F0D]/70" />

                <Link href="/" className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-[#22C55E] flex items-center justify-center">
                        <span className="text-[#0B0F0D] font-bold text-sm">P</span>
                    </div>
                    <span className="text-[#F5F7F5] font-semibold text-lg tracking-tight">
                        Playscore
                    </span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-[#F5F7F5] text-3xl font-semibold leading-tight mb-4">
                        Rate it. Review it.<br />Remember it.
                    </h2>
                    <p className="text-[#8B948F] text-base leading-relaxed max-w-sm mb-6">
                        Track every game you play, share honest reviews, and
                        discover what to play next based on what you actually like.
                    </p>

                    <div className="flex items-center gap-2">
                        {slideImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveSlide(i)}
                                className={`h-1.5 rounded-full transition-all ${i === activeSlide
                                    ? 'w-6 bg-[#22C55E]'
                                    : 'w-1.5 bg-[#F5F7F5]/30 hover:bg-[#F5F7F5]/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-[#5A625D] text-sm">
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