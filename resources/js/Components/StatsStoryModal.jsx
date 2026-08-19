import { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import { toBlob } from 'html-to-image';

export default function StatsStoryModal({ show, onClose, user, stats, reviews = [] }) {
    const [theme, setTheme] = useState('emerald');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState('');
    const cardRef = useRef(null);

    const {
        totalReviews = 0,
        totalGamesInList = 0,
        averageScore = 0,
        reviewsByGenre = {},
    } = stats || {};

    // Calculate Top Genre
    const topGenre = Object.entries(reviewsByGenre).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Gamer';

    // Top Rated Game
    const topGame = reviews && reviews.length > 0
        ? [...reviews].sort((a, b) => Number(b.rating) - Number(a.rating))[0]
        : null;

    const avatarUrl = user?.avatar ? `/storage/${user.avatar}` : null;
    const initials = user?.name
        ? user.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : 'PS';

    const themes = {
        emerald: {
            name: 'Neon Emerald',
            bg: 'bg-gradient-to-b from-[#091D12] via-[#0B0F0D] to-[#122A1C]',
            border: 'border-[#22C55E]/40',
            accent: 'text-[#22C55E]',
            accentBg: 'bg-[#22C55E]',
            pillBg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
            cardBg: 'bg-[#131916]/90 border-[#1F2923]',
            button: 'bg-[#22C55E] text-[#0B0F0D] hover:bg-[#16A34A]',
            glow: 'rgba(34, 197, 94, 0.25)',
        },
        cyber: {
            name: 'Cyber Violet',
            bg: 'bg-gradient-to-b from-[#1E0C30] via-[#0D0814] to-[#2B0E46]',
            border: 'border-[#A855F7]/40',
            accent: 'text-[#A855F7]',
            accentBg: 'bg-[#A855F7]',
            pillBg: 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/30',
            cardBg: 'bg-[#181124]/90 border-[#2E1D45]',
            button: 'bg-[#A855F7] text-white hover:bg-[#9333EA]',
            glow: 'rgba(168, 85, 247, 0.25)',
        },
        sunset: {
            name: 'Sunset Flare',
            bg: 'bg-gradient-to-b from-[#2A0E0E] via-[#0F0A0A] to-[#3B140E]',
            border: 'border-[#F97316]/40',
            accent: 'text-[#F97316]',
            accentBg: 'bg-[#F97316]',
            pillBg: 'bg-[#F97316]/15 text-[#FB923C] border-[#F97316]/30',
            cardBg: 'bg-[#1D1313]/90 border-[#382020]',
            button: 'bg-[#F97316] text-white hover:bg-[#EA580C]',
            glow: 'rgba(249, 115, 22, 0.25)',
        },
        ocean: {
            name: 'Ocean Sapphire',
            bg: 'bg-gradient-to-b from-[#09182E] via-[#080E1A] to-[#0D2447]',
            border: 'border-[#3B82F6]/40',
            accent: 'text-[#3B82F6]',
            accentBg: 'bg-[#3B82F6]',
            pillBg: 'bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30',
            cardBg: 'bg-[#101A2B]/90 border-[#1D2E4A]',
            button: 'bg-[#3B82F6] text-white hover:bg-[#2563EB]',
            glow: 'rgba(59, 130, 246, 0.25)',
        },
        crimson: {
            name: 'Ruby Crimson',
            bg: 'bg-gradient-to-b from-[#280B0E] via-[#120708] to-[#401014]',
            border: 'border-[#EF4444]/40',
            accent: 'text-[#EF4444]',
            accentBg: 'bg-[#EF4444]',
            pillBg: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30',
            cardBg: 'bg-[#1F1113]/90 border-[#3D1D20]',
            button: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
            glow: 'rgba(239, 68, 68, 0.25)',
        },
        gold: {
            name: 'Luxury Gold',
            bg: 'bg-gradient-to-b from-[#211A0A] via-[#0D0B07] to-[#362A10]',
            border: 'border-[#EAB308]/40',
            accent: 'text-[#EAB308]',
            accentBg: 'bg-[#EAB308]',
            pillBg: 'bg-[#EAB308]/15 text-[#FDE047] border-[#EAB308]/30',
            cardBg: 'bg-[#1C1810]/90 border-[#38301B]',
            button: 'bg-[#EAB308] text-[#0B0F0D] hover:bg-[#CA8A04]',
            glow: 'rgba(234, 179, 8, 0.25)',
        },
    };

    const currentTheme = themes[theme] || themes.emerald;

    const generateImageBlob = async () => {
        if (!cardRef.current) return null;
        try {
            return await toBlob(cardRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            });
        } catch (err) {
            console.error('Failed to capture card image:', err);
            return null;
        }
    };

    const handleSavePng = async () => {
        setIsGenerating(true);
        setMessage('');
        const blob = await generateImageBlob();
        if (blob) {
            triggerDownload(blob);
            setMessage('✓ PNG image downloaded successfully!');
        } else {
            setMessage('Failed to download image.');
        }
        setIsGenerating(false);
    };

    const handleShareIgStory = async () => {
        setIsGenerating(true);
        setMessage('');

        const blob = await generateImageBlob();

        if (!blob) {
            setMessage('Failed to generate story image. Please try again.');
            setIsGenerating(false);
            return;
        }

        const file = new File([blob], `playscore-stats-${user?.name || 'user'}.png`, {
            type: 'image/png',
        });

        // Use Web Share API for direct Instagram / Mobile share sheet
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: `${user?.name} PlayScore Stats`,
                    text: `Check out my gaming stats on PlayScore!`,
                });
                setMessage('Opening Instagram share sheet...');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    triggerDownload(blob);
                    setMessage('Image downloaded! Upload to your Instagram Story.');
                }
            }
        } else {
            // Fallback for Desktop / Unsupported browser
            triggerDownload(blob);
            const profileLink = window.location.href;
            try {
                await navigator.clipboard.writeText(profileLink);
            } catch (e) {}
            setMessage('✓ Image downloaded & Profile link copied! Open Instagram on your phone to upload from gallery.');
        }

        setIsGenerating(false);
    };

    const triggerDownload = (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `playscore-stats-${user?.name || 'user'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyProfileLink = () => {
        const profileLink = window.location.href;
        navigator.clipboard.writeText(profileLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-4 sm:p-6 bg-[#0B0F0D] text-[#F5F7F5] rounded-2xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col items-center">
                {/* Modal Header */}
                <div className="w-full flex items-center justify-between mb-3 border-b border-[#1F2923] pb-3 shrink-0">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                            <span>🎮</span> PlayScore Stats Card
                        </h2>
                        <p className="text-[#8B948F] text-xs mt-2">
                            Share your gaming achievements and PlayScore statistics to your Instagram Story!
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#8B948F] hover:text-white text-lg font-bold px-2 py-1 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Theme Selector Controls (3 top, 3 bottom) */}
                <div className="grid grid-cols-3 gap-2 mb-3 w-full max-w-[360px] justify-center shrink-0">
                    {Object.keys(themes).map((tKey) => (
                        <button
                            key={tKey}
                            onClick={() => setTheme(tKey)}
                            className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border transition text-center truncate ${theme === tKey
                                ? `${themes[tKey].accentBg} text-black font-extrabold shadow-md`
                                : 'bg-[#131916] text-[#8B948F] border-[#1F2923] hover:text-white'
                                }`}
                        >
                            {themes[tKey].name}
                        </button>
                    ))}
                </div>

                {/* --- 9:16 STORY CARD SCROLLABLE PREVIEW CONTAINER --- */}
                <div className="w-full max-h-[380px] sm:max-h-[420px] overflow-y-auto custom-scrollbar border border-[#1F2923] rounded-2xl p-3 bg-[#070A08] mb-4 shadow-inner">
                    <div className="flex justify-center items-start min-h-max py-1">
                        <div className="relative shadow-2xl rounded-2xl overflow-hidden shrink-0">
                            <div
                                ref={cardRef}
                                className={`w-[310px] h-[550px] p-6 flex flex-col justify-between relative overflow-hidden select-none ${currentTheme.bg}`}
                                style={{
                                    boxShadow: `0 20px 40px ${currentTheme.glow}`,
                                }}
                            >
                                {/* Background Decorative Neon Orbs */}
                                <div
                                    className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                                    style={{ backgroundColor: currentTheme.glow }}
                                />
                                <div
                                    className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                                    style={{ backgroundColor: currentTheme.glow }}
                                />

                                {/* Top Bar: Left Icon P, Center PLAYSCORE STATS, Right 2026 */}
                                <div className="grid grid-cols-3 items-center z-10 w-full">
                                    <div className="flex justify-start">
                                        <div className={`w-8 h-8 rounded-lg bg-[#0B0F0D] border ${currentTheme.border} flex items-center justify-center font-black text-sm ${currentTheme.accent}`}>
                                            P
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <span className="font-extrabold tracking-wider text-[11px] sm:text-xs text-white uppercase whitespace-nowrap">
                                            PLAYSCORE STATS
                                        </span>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${currentTheme.pillBg}`}>
                                            2026
                                        </span>
                                    </div>
                                </div>

                            {/* User Header Section */}
                            <div className="my-auto py-2 z-10 text-center flex flex-col items-center">
                                <div
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 p-1 mb-2 sm:mb-3 shadow-lg ${currentTheme.border}`}
                                >
                                    <div className="w-full h-full rounded-full bg-[#131916] overflow-hidden flex items-center justify-center font-bold text-lg sm:text-xl text-white">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className={currentTheme.accent}>{initials}</span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md truncate max-w-[240px]">
                                    {user?.name || 'Gamer'}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-white/70 font-medium mt-0.5">
                                    Top Genre: <span className={`font-bold ${currentTheme.accent}`}>{topGenre}</span>
                                </p>
                            </div>

                            {/* Middle: Big Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 z-10 mb-2 sm:mb-3">
                                <div className={`p-2.5 sm:p-3 rounded-xl text-center border backdrop-blur-md ${currentTheme.cardBg}`}>
                                    <p className="text-[9px] text-white/60 font-semibold uppercase whitespace-nowrap">Reviewed</p>
                                    <p className={`text-base sm:text-lg font-black mt-0.5 ${currentTheme.accent}`}>
                                        {totalReviews}
                                    </p>
                                </div>
                                <div className={`p-2.5 sm:p-3 rounded-xl text-center border backdrop-blur-md ${currentTheme.cardBg}`}>
                                    <p className="text-[9px] text-white/60 font-semibold uppercase whitespace-nowrap">In List</p>
                                    <p className="text-base sm:text-lg font-black text-white mt-0.5">
                                        {totalGamesInList}
                                    </p>
                                </div>
                                <div className={`p-2.5 sm:p-3 rounded-xl text-center border backdrop-blur-md ${currentTheme.cardBg}`}>
                                    <p className="text-[9px] text-white/60 font-semibold uppercase whitespace-nowrap">Avg Score</p>
                                    <p className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center justify-center gap-1">
                                        <span className="text-xs sm:text-sm font-normal">★</span> {averageScore}
                                    </p>
                                </div>
                            </div>

                            {/* Highest Rated Game Highlight */}
                            {topGame && (
                                <div className={`p-2.5 sm:p-3 rounded-xl border backdrop-blur-md flex items-center gap-2.5 sm:gap-3 z-10 mb-2 sm:mb-3 ${currentTheme.cardBg}`}>
                                    <img
                                        src={topGame.game?.cover_url}
                                        alt={topGame.game?.title}
                                        className="w-10 h-12 sm:w-12 sm:h-14 rounded-lg object-cover shrink-0 border border-white/10"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[8px] sm:text-[9px] text-white/50 font-bold uppercase tracking-wider">Top Rated Game</p>
                                        <h4 className="text-xs font-bold text-white truncate mt-0.5">
                                            {topGame.game?.title}
                                        </h4>
                                        <p className={`text-xs font-black mt-0.5 ${currentTheme.accent}`}>
                                            Score: {topGame.rating} / 10 <span className="text-[10px] font-normal">★</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Footer Card Info */}
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between z-10 text-[10px] text-white/60 font-semibold">
                                <span>Track your gaming journey</span>
                                <span className="font-bold text-white/90">play-score.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                {/* Status Message */}
                {message && (
                    <div className="mb-3 text-xs text-center text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-2 rounded-lg w-full font-medium shrink-0">
                        {message}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="w-full space-y-2 shrink-0">
                    <button
                        onClick={handleShareIgStory}
                        disabled={isGenerating}
                        className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-lg ${currentTheme.button} disabled:opacity-50`}
                    >
                        {isGenerating ? (
                            <span>Generating Image...</span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span>Share to IG Story</span>
                            </>
                        )}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSavePng}
                            disabled={isGenerating}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#131916] border border-[#1F2923] text-xs font-semibold text-[#8B948F] hover:text-white hover:border-[#2E3A32] transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            <span>💾 Save PNG</span>
                        </button>

                        <button
                            onClick={handleCopyProfileLink}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#131916] border border-[#1F2923] text-xs font-semibold text-[#8B948F] hover:text-white hover:border-[#2E3A32] transition flex items-center justify-center gap-1.5"
                        >
                            <span>{copied ? '✓ Link Copied!' : '🔗 Copy Profile Link'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
