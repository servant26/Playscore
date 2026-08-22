import { useState, useRef, useMemo } from 'react';
import Modal from '@/Components/Modal';
import { toBlob } from 'html-to-image';
import { getRankInfo } from '@/Utils/rankSystem';

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

    const rankInfo = getRankInfo(totalReviews);
    const cRank = rankInfo.currentRank;

    // Calculate Top 5 Genres
    const top5Genres = Object.entries(reviewsByGenre)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genre]) => genre);

    // Top Rated Game
    const topGame = reviews && reviews.length > 0
        ? [...reviews].sort((a, b) => Number(b.rating) - Number(a.rating))[0]
        : null;

    // Most Played Franchise/Series
    const mostPlayedSeries = useMemo(() => {
        if (!reviews || reviews.length === 0) return null;

        const seriesCounts = {};
        const seriesCovers = {};

        reviews.forEach((r) => {
            if (!r.game || !r.game.title) return;
            let title = r.game.title.trim();
            // Extract series root name (e.g., "Tekken 5" -> "Tekken", "God of War II" -> "God of War")
            let rootName = title
                .replace(/\s*:\s*.*/, '') // Remove subtitle after colon
                .replace(/\s+\d+.*$/, '') // Remove trailing numbers (e.g. 5, 2, 3)
                .replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)+$/i, '') // Remove Roman numerals
                .replace(/\s+\(.*?\)/g, '') // Remove parentheses (2005)
                .trim();

            if (rootName.length < 3) rootName = title;

            seriesCounts[rootName] = (seriesCounts[rootName] || 0) + 1;
            if (!seriesCovers[rootName]) {
                seriesCovers[rootName] = r.game.cover_url;
            }
        });

        const sortedSeries = Object.entries(seriesCounts).sort((a, b) => b[1] - a[1]);
        if (sortedSeries.length === 0) return null;

        const [topSeriesName, count] = sortedSeries[0];
        return {
            name: topSeriesName,
            count,
            cover_url: seriesCovers[topSeriesName],
        };
    }, [reviews]);

    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith('http://') || user.avatar.startsWith('https://') || user.avatar.startsWith('data:')
            ? user.avatar
            : `/storage/${user.avatar}`)
        : null;
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
            <div className="p-3.5 sm:p-4 bg-[#0B0F0D] text-[#F5F7F5] rounded-2xl max-h-[90vh] flex flex-col items-center">
                {/* Modal Header */}
                <div className="w-full flex items-center justify-between mb-2 border-b border-[#1F2923] pb-2 shrink-0">
                    <div>
                        <h2 className="text-sm sm:text-base font-bold">
                            PlayScore Stats Card
                        </h2>
                        <p className="text-[#8B948F] text-[11px] mt-0.5">
                            Share your gaming achievements and PlayScore statistics to your Instagram Story!
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#8B948F] hover:text-white text-base font-bold px-2 py-0.5 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Theme Selector Controls */}
                <div className="grid grid-cols-3 gap-1.5 mb-2 w-full max-w-[360px] justify-center shrink-0">
                    {Object.keys(themes).map((tKey) => (
                        <button
                            key={tKey}
                            onClick={() => setTheme(tKey)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition text-center truncate ${theme === tKey
                                ? `${themes[tKey].accentBg} text-black font-extrabold shadow-md`
                                : 'bg-[#131916] text-[#8B948F] border-[#1F2923] hover:text-white'
                                }`}
                        >
                            {themes[tKey].name}
                        </button>
                    ))}
                </div>

                {/* --- 9:16 STORY CARD SCROLLABLE PREVIEW CONTAINER --- */}
                <div className="w-full max-h-[290px] sm:max-h-[330px] overflow-y-auto custom-scrollbar border border-[#1F2923] rounded-xl p-2 bg-[#070A08] mb-2.5 shadow-inner">
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

                                {/* Top Header: Centered PLAYSCORE STATS */}
                                <div className="w-full text-center z-10 py-1">
                                    <span className="font-extrabold tracking-widest text-xs sm:text-sm text-white uppercase drop-shadow">
                                        PLAYSCORE STATS
                                    </span>
                                </div>

                                {/* User Header Section */}
                                <div className="my-auto py-2 z-10 text-center flex flex-col items-center">
                                    <div
                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 p-1 mb-2 shadow-lg ${currentTheme.border}`}
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

                                    {/* Pure Text Rank Description - Subtle & Compact */}
                                    <p className="text-[10px] text-white/70 font-normal mt-0.5">
                                        <span className={`font-semibold ${currentTheme.accent}`}>{cRank.name}</span> with {cRank.min}+ Reviews
                                    </p>

                                    {/* Top 5 Genres Pills (Gray Badges: 3 on row 1, 2 on row 2) */}
                                    {top5Genres.length > 0 && (
                                        <div className="mt-2 w-full flex flex-col items-center gap-1.5 max-w-[260px]">
                                            {/* Row 1: Max 3 Badges */}
                                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                {top5Genres.slice(0, 3).map((genre, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[9px] font-medium px-2.5 py-0.5 rounded-md bg-[#19221D]/80 text-[#9DA8A2] border border-[#2A3730]"
                                                    >
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                            {/* Row 2: Remaining 2 Badges */}
                                            {top5Genres.length > 3 && (
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                    {top5Genres.slice(3, 5).map((genre, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-[9px] font-medium px-2.5 py-0.5 rounded-md bg-[#19221D]/80 text-[#9DA8A2] border border-[#2A3730]"
                                                        >
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
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

                                {/* Highlights Section: Top Rated Game & Most Played Series */}
                                <div className="space-y-1.5 z-10 mb-2 sm:mb-3">
                                    {topGame && (
                                        <div className={`p-2 rounded-xl border backdrop-blur-md flex items-center gap-2.5 ${currentTheme.cardBg}`}>
                                            <img
                                                src={topGame.game?.cover_url}
                                                alt={topGame.game?.title}
                                                className="w-9 h-11 rounded-lg object-cover shrink-0 border border-white/10"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[8px] text-white/50 font-bold uppercase tracking-wider">Top Rated Game</p>
                                                <h4 className="text-[11px] font-bold text-white truncate mt-0.5">
                                                    {topGame.game?.title}
                                                </h4>
                                                <p className={`text-[11px] font-black mt-0.5 ${currentTheme.accent}`}>
                                                    Score: {topGame.rating} / 10 <span className="text-[9px] font-normal">★</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {mostPlayedSeries && (
                                        <div className={`p-2 rounded-xl border backdrop-blur-md flex items-center gap-2.5 ${currentTheme.cardBg}`}>
                                            <img
                                                src={mostPlayedSeries.cover_url}
                                                alt={mostPlayedSeries.name}
                                                className="w-9 h-11 rounded-lg object-cover shrink-0 border border-white/10"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[8px] text-white/50 font-bold uppercase tracking-wider">Most Played Series</p>
                                                <h4 className="text-[11px] font-bold text-white truncate mt-0.5">
                                                    {mostPlayedSeries.name} Series
                                                </h4>
                                                <p className={`text-[11px] font-black mt-0.5 ${currentTheme.accent}`}>
                                                    {mostPlayedSeries.count} {mostPlayedSeries.count === 1 ? 'Game' : 'Games Played'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Card Info */}
                                <div className="pt-2 border-t border-white/10 flex items-center justify-between z-10 text-[10px] text-white/60 font-semibold">
                                    <span>Track your gaming journey</span>
                                    <span className="font-bold text-white/90">©Playscore</span>
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

                {/* Action Buttons - Pure text, no icons */}
                <div className="w-full space-y-1.5 shrink-0">
                    <button
                        onClick={handleShareIgStory}
                        disabled={isGenerating}
                        className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg ${currentTheme.button} disabled:opacity-50`}
                    >
                        {isGenerating ? 'Generating Image...' : 'Share to IG Story'}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSavePng}
                            disabled={isGenerating}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-[#131916] border border-[#1F2923] text-[11px] sm:text-xs font-semibold text-[#8B948F] hover:text-white hover:border-[#2E3A32] transition flex items-center justify-center disabled:opacity-50"
                        >
                            Save PNG
                        </button>

                        <button
                            onClick={handleCopyProfileLink}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-[#131916] border border-[#1F2923] text-[11px] sm:text-xs font-semibold text-[#8B948F] hover:text-[#F5F7F5] hover:border-[#2E3A32] transition flex items-center justify-center"
                        >
                            {copied ? 'Link Copied!' : 'Copy Profile Link'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
