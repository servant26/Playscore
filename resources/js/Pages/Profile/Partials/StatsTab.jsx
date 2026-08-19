import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import StatsStoryModal from '@/Components/StatsStoryModal';

export default function StatsTab({ stats, myReviews = [], user, onSelectTab, showDownload = true }) {
    const pageUser = usePage().props.auth?.user;
    const currentUser = user || pageUser;
    const [showStoryModal, setShowStoryModal] = useState(false);
    const {
        totalReviews = 0,
        totalGamesInList = 0,
        averageScore = 0,
        reviewsByGenre = {},
        reviewsByYear = {},
        ratingDistribution = {},
    } = stats || {};

    const handleDownloadStats = () => {
        const formatGames = (count) => (count === 1 ? '1 Game' : `${count} Games`);

        const genreRows = Object.entries(reviewsByGenre)
            .map(([genre, count]) => `<tr><td>${genre}</td><td style="text-align:right;">${formatGames(count)}</td></tr>`)
            .join('');

        const gameRows = myReviews && myReviews.length > 0
            ? myReviews.map((rev, idx) => `
                <tr>
                    <td style="width:40px;text-align:center;">${idx + 1}</td>
                    <td>${rev.game ? rev.game.title : 'Unknown Game'}</td>
                    <td style="width:90px;text-align:right;font-weight:normal;">★ ${rev.rating || '-'} / 10</td>
                </tr>
            `).join('')
            : `<tr><td colspan="3" style="text-align:center;">(No reviewed games)</td></tr>`;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Playscore_User_Statistics</title>
                <style>
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    @media print {
                        body {
                            padding: 15mm !important;
                        }
                    }
                    body {
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background-color: #FFFFFF;
                        color: #0F172A;
                        margin: 0;
                        padding: 24px;
                        line-height: 1.4;
                    }
                    .doc-header {
                        border-bottom: 2px solid #0F172A;
                        padding-bottom: 12px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .doc-title {
                        font-size: 16pt;
                        font-weight: bold;
                        margin: 0;
                    }
                    .doc-subtitle {
                        font-size: 9pt;
                        color: #64748B;
                    }
                    .summary-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .summary-table td {
                        padding: 10px 14px;
                        border: 1px solid #0F172A;
                        font-size: 10.5pt;
                        text-align: center;
                    }
                    .section-heading {
                        font-size: 11pt;
                        font-weight: bold;
                        margin-top: 18px;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        border-bottom: 1px solid #0F172A;
                        padding-bottom: 4px;
                    }
                    table.formal-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 16px;
                    }
                    table.formal-table th, table.formal-table td {
                        border: 1px solid #0F172A;
                        padding: 7px 10px;
                        font-size: 10pt;
                    }
                    table.formal-table th {
                        background-color: #F1F5F9;
                        font-weight: bold;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="doc-header">
                    <div>
                        <h1 class="doc-title">Playscore User Statistics</h1>
                        <div class="doc-subtitle">Gaming Collection & Review Report</div>
                    </div>
                    <div class="doc-subtitle">
                        ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>

                <table class="summary-table">
                    <tr>
                        <td><strong>Games in List:</strong> ${formatGames(totalGamesInList)}</td>
                        <td><strong>Reviewed Games:</strong> ${formatGames(totalReviews)}</td>
                        <td><strong>Average Score:</strong> ★ ${averageScore} / 10</td>
                    </tr>
                </table>

                <div class="section-heading">Genre Breakdown</div>
                <table class="formal-table">
                    <thead>
                        <tr>
                            <th>Genre</th>
                            <th style="width: 140px; text-align: right;">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${genreRows || '<tr><td colspan="2" style="text-align:center;">(No genre data)</td></tr>'}
                    </tbody>
                </table>

                <div class="section-heading">Rating Distribution</div>
                <table class="formal-table">
                    <thead>
                        <tr>
                            <th>Rating Scale</th>
                            <th style="width: 140px; text-align: right;">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>★ 1 - 3</td><td style="text-align:right;">${formatGames(ratingDistribution['1-3'] || 0)}</td></tr>
                        <tr><td>★ 4 - 6</td><td style="text-align:right;">${formatGames(ratingDistribution['4-6'] || 0)}</td></tr>
                        <tr><td>★ 7 - 8</td><td style="text-align:right;">${formatGames(ratingDistribution['7-8'] || 0)}</td></tr>
                        <tr><td>★ 9 - 10</td><td style="text-align:right;">${formatGames(ratingDistribution['9-10'] || 0)}</td></tr>
                    </tbody>
                </table>

                <div class="section-heading">Reviewed Games List</div>
                <table class="formal-table">
                    <thead>
                        <tr>
                            <th style="width: 40px; text-align: center;">No.</th>
                            <th>Game Title</th>
                            <th style="width: 90px; text-align: right;">Your Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gameRows}
                    </tbody>
                </table>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    };

    // Chart view type toggles ('pie' | 'bar')
    const [genreView, setGenreView] = useState('pie');
    const [ratingView, setRatingView] = useState('bar');

    // Vibrant multi-color palette for pie chart & genre visual contrast
    const VIBRANT_COLORS = [
        '#22C55E', // Green
        '#3B82F6', // Blue
        '#F59E0B', // Amber / Yellow
        '#EC4899', // Pink
        '#8B5CF6', // Purple
        '#06B6D4', // Cyan
        '#F97316', // Orange
        '#10B981', // Emerald
        '#6366F1', // Indigo
        '#EF4444', // Red
    ];

    // Hover state tracking for pie slice interactive tooltips
    const [hoveredGenreIndex, setHoveredGenreIndex] = useState(null);
    const [hoveredRatingIndex, setHoveredRatingIndex] = useState(null);

    // 1. Pie Chart Calculations (Reviews by Genre)
    const genreChartData = useMemo(() => {
        const entries = Object.entries(reviewsByGenre);
        const total = entries.reduce((sum, [, count]) => sum + count, 0);

        if (total === 0) return { slices: [], legend: [], entries: [] };

        let currentAngle = 0;
        const maxCount = Math.max(...entries.map(([, c]) => c), 1);

        const slices = entries.map(([genre, count], idx) => {
            const percentage = count / total;
            const angle = percentage * 360;

            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            // SVG Pie Arc path
            const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = total === count
                ? 'M 50 10 A 40 40 0 1 1 49.99 10 Z'
                : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const midAngle = startAngle + angle / 2;
            const rad = (Math.PI * (midAngle - 90)) / 180;
            // Arc boundary point
            const lineX1 = 50 + 40 * Math.cos(rad);
            const y1Line = 50 + 40 * Math.sin(rad);
            // Longer outer pointer end point
            const lineX2 = 50 + 54 * Math.cos(rad);
            const y2Line = 50 + 54 * Math.sin(rad);
            // Outer text position
            const textX = 50 + 62 * Math.cos(rad);
            const textY = 50 + 62 * Math.sin(rad);

            const color = VIBRANT_COLORS[idx % VIBRANT_COLORS.length];

            return {
                genre,
                count,
                percentage: Math.round(percentage * 100),
                pathData,
                lineX1,
                lineY1: y1Line,
                lineX2,
                lineY2: y2Line,
                textX,
                textY,
                angle,
                midAngle,
                color,
            };
        });

        return { slices, total, maxCount, entries };
    }, [reviewsByGenre]);

    // 2. Line Chart Calculations (Reviews by Release Year)
    const yearChartData = useMemo(() => {
        const entries = Object.entries(reviewsByYear);
        if (entries.length === 0) return { path: '', points: [], maxCount: 0 };

        const maxCount = Math.max(...entries.map(([, c]) => c), 1);
        const padding = 20;
        const width = 300;
        const height = 120;

        const points = entries.map(([year, count], idx) => {
            const x = entries.length === 1
                ? width / 2
                : padding + (idx / (entries.length - 1)) * (width - 2 * padding);
            const y = height - padding - (count / maxCount) * (height - 2 * padding);
            return { year, count, x, y };
        });

        const path = points.reduce((acc, p, i) => {
            return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
        }, '');

        return { path, points, maxCount };
    }, [reviewsByYear]);

    // 3. Bar & Pie Chart Data (Rating Score Distribution)
    const ratingChartData = useMemo(() => {
        const entries = [
            { label: '★ 1 - 3', count: ratingDistribution['1-3'] || 0, color: '#EF4444' },
            { label: '★ 4 - 6', count: ratingDistribution['4-6'] || 0, color: '#F59E0B' },
            { label: '★ 7 - 8', count: ratingDistribution['7-8'] || 0, color: '#3B82F6' },
            { label: '★ 9 - 10', count: ratingDistribution['9-10'] || 0, color: '#22C55E' },
        ];

        const total = entries.reduce((sum, e) => sum + e.count, 0);
        const maxCount = Math.max(...entries.map((e) => e.count), 1);

        let currentAngle = 0;
        const slices = entries.map((item) => {
            const percentage = total > 0 ? item.count / total : 0;
            const angle = percentage * 360;

            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = total > 0 && total === item.count
                ? 'M 50 10 A 40 40 0 1 1 49.99 10 Z'
                : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const midAngle = startAngle + angle / 2;
            const rad = (Math.PI * (midAngle - 90)) / 180;
            const lineX1 = 50 + 40 * Math.cos(rad);
            const y1Line = 50 + 40 * Math.sin(rad);
            const lineX2 = 50 + 54 * Math.cos(rad);
            const y2Line = 50 + 54 * Math.sin(rad);
            const textX = 50 + 62 * Math.cos(rad);
            const textY = 50 + 62 * Math.sin(rad);

            return {
                ...item,
                percentage: Math.round(percentage * 100),
                pathData,
                lineX1,
                lineY1: y1Line,
                lineX2,
                lineY2: y2Line,
                textX,
                textY,
                angle,
                midAngle,
            };
        });

        return { entries, maxCount, slices, total };
    }, [ratingDistribution]);

    if (totalReviews === 0 && totalGamesInList === 0) {
        return (
            <div className="bg-[#131916] border border-[#1F2923] rounded-xl p-10 text-center">
                <p className="text-[#8B948F] text-sm mb-2">
                    No stats available yet.
                </p>
                <p className="text-[#5A625D] text-xs">
                    Start adding games to your list or reviewing games to view your personal statistics!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header & Download Action */}
            {showDownload && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[#131916] border border-[#1F2923] rounded-xl p-4 sm:p-5">
                    <div>
                        <h2 className="text-[#F5F7F5] text-base sm:text-lg font-bold">
                            User Statistics
                        </h2>
                        <p className="text-[#8B948F] text-xs mt-0.5">
                            Overview of your gaming collection and review insights.
                        </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setShowStoryModal(true)}
                            className="flex-1 sm:flex-none justify-center rounded-lg bg-[#131916] border border-[#22C55E] text-[#F5F7F5] hover:bg-[#22C55E] hover:text-[#0B0F0D] font-bold px-3.5 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            <span>Share to IG Story</span>
                        </button>

                        <button
                            onClick={handleDownloadStats}
                            className="flex-1 sm:flex-none justify-center rounded-lg bg-[#131916] border border-[#22C55E] text-[#F5F7F5] hover:bg-[#22C55E] hover:text-[#0B0F0D] font-bold px-3.5 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm shrink-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            </svg>
                            <span>Download Stats</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Top Overview Cards */}
            <div className={`grid gap-3 sm:gap-4 ${showDownload ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
                {/* 1. Games in List (Only for personal profile where showDownload is true) */}
                {showDownload && (
                    <div
                        onClick={() => onSelectTab && onSelectTab('gamelist')}
                        className="bg-[#131916] border border-[#1F2923] rounded-xl p-3 sm:p-5 text-center cursor-pointer hover:border-[#2E3A32] hover:bg-[#19211d] transition group"
                    >
                        <p className="text-[#8B948F] group-hover:text-[#F5F7F5] text-xs font-medium mb-1 transition">
                            Games in List
                        </p>
                        <p className="text-[#F5F7F5] text-xl sm:text-3xl font-bold">{totalGamesInList}</p>
                    </div>
                )}

                {/* 2. Reviewed Games (Clickable -> 'myreview' when on personal profile) */}
                <div
                    onClick={() => showDownload && onSelectTab && onSelectTab('myreview')}
                    className={`bg-[#131916] border border-[#1F2923] rounded-xl p-3 sm:p-5 text-center transition group ${showDownload ? 'cursor-pointer hover:border-[#2E3A32] hover:bg-[#19211d]' : ''}`}
                >
                    <p className={`text-[#8B948F] text-xs font-medium mb-1 transition ${showDownload ? 'group-hover:text-[#F5F7F5]' : ''}`}>
                        Reviewed Games
                    </p>
                    <p className="text-[#F5F7F5] text-xl sm:text-3xl font-bold">{totalReviews}</p>
                </div>

                {/* 3. Average Score */}
                <div className={`bg-[#131916] border border-[#1F2923] rounded-xl p-3 sm:p-5 text-center ${showDownload ? 'col-span-2 sm:col-span-1' : 'col-span-1'}`}>
                    <p className="text-[#8B948F] text-xs font-medium mb-1">Average Score</p>
                    <p className="text-[#22C55E] text-xl sm:text-3xl font-bold">★ {averageScore}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* 1. Genre Breakdown (Toggle between Pie Chart & Bar Chart) */}
                <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-5 sm:p-6 flex flex-col sm:h-[340px]">
                    <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
                        <div>
                            <h3 className="text-[#F5F7F5] text-base font-semibold">
                                Genre Breakdown
                            </h3>
                            <p className="text-[#8B948F] text-xs mt-0.5">
                                Distribution of reviewed games across genres.
                            </p>
                        </div>
                        {/* Toggle Buttons */}
                        <div className="flex items-center bg-[#0B0F0D] border border-[#1F2923] rounded-lg p-0.5 shrink-0">
                            <button
                                onClick={() => setGenreView('pie')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${genreView === 'pie'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-white'
                                    }`}
                            >
                                Pie
                            </button>
                            <button
                                onClick={() => setGenreView('bar')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${genreView === 'bar'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-white'
                                    }`}
                            >
                                Bar
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col justify-center">
                        {genreChartData.slices.length === 0 ? (
                            <p className="text-[#5A625D] text-xs text-center py-8">
                                No genre data available.
                            </p>
                        ) : genreView === 'pie' ? (
                            /* Pie View */
                            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 my-auto h-full">
                                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 my-2 sm:my-0">
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-lg overflow-visible">
                                        {genreChartData.slices.map((slice, idx) => (
                                            <g key={idx}>
                                                <path
                                                    d={slice.pathData}
                                                    fill={slice.color}
                                                    onMouseEnter={() => setHoveredGenreIndex(idx)}
                                                    onMouseLeave={() => setHoveredGenreIndex(null)}
                                                    className={`transition duration-300 cursor-pointer ${hoveredGenreIndex === idx ? 'opacity-100 filter drop-shadow-md' : 'opacity-90 hover:opacity-100'
                                                        }`}
                                                />
                                                {/* Outer Pointer Line & Callout Label on Hover */}
                                                {hoveredGenreIndex === idx && (
                                                    <g className="pointer-events-none">
                                                        <line
                                                            x1={slice.lineX1}
                                                            y1={slice.lineY1}
                                                            x2={slice.lineX2}
                                                            y2={slice.lineY2}
                                                            stroke={slice.color}
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        />
                                                        <circle cx={slice.lineX2} cy={slice.lineY2} r="1.5" fill={slice.color} />
                                                        <text
                                                            x={slice.textX}
                                                            y={slice.textY}
                                                            textAnchor={slice.textX >= 50 ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            className="transform rotate-90 text-[6.5px] font-extrabold fill-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)]"
                                                            style={{ transformOrigin: `${slice.textX}px ${slice.textY}px` }}
                                                        >
                                                            {slice.genre} ({slice.percentage}%)
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                <div className="flex-1 space-y-2 w-full max-h-56 sm:max-h-48 overflow-y-auto pr-1.5 custom-scrollbar my-auto">
                                    {genreChartData.slices.map((slice, idx) => (
                                        <div
                                            key={idx}
                                            onMouseEnter={() => setHoveredGenreIndex(idx)}
                                            onMouseLeave={() => setHoveredGenreIndex(null)}
                                            className={`flex items-center justify-between text-xs p-1.5 rounded-md transition cursor-pointer ${hoveredGenreIndex === idx ? 'bg-[#1F2923]' : 'hover:bg-[#19211d]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 truncate pr-2">
                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: slice.color }}
                                                />
                                                <span className="text-[#F5F7F5] truncate font-medium">{slice.genre}</span>
                                            </div>
                                            <span className="text-[#8B948F] font-medium shrink-0">
                                                {slice.count} ({slice.percentage}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Bar View (Scrollable if many genres) */
                            <div className="space-y-3 max-h-64 sm:max-h-56 overflow-y-auto pr-1.5 custom-scrollbar my-auto">
                                {genreChartData.slices.map((slice, idx) => {
                                    const percent = (slice.count / genreChartData.maxCount) * 100;
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[#F5F7F5] font-medium">{slice.genre}</span>
                                                <span className="text-[#8B948F] font-semibold">{slice.count} games</span>
                                            </div>
                                            <div className="w-full bg-[#0B0F0D] h-2.5 rounded-full overflow-hidden border border-[#1F2923]">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${Math.max(percent, 5)}%`,
                                                        backgroundColor: slice.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* 2. Rating Distribution (Toggle between Bar Chart & Pie Chart) */}
                <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-5 sm:p-6 flex flex-col sm:h-[340px]">
                    <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
                        <div>
                            <h3 className="text-[#F5F7F5] text-base font-semibold">
                                Rating Distribution
                            </h3>
                            <p className="text-[#8B948F] text-xs mt-0.5">
                                Spread of scores you've given to reviewed games.
                            </p>
                        </div>
                        {/* Toggle Buttons */}
                        <div className="flex items-center bg-[#0B0F0D] border border-[#1F2923] rounded-lg p-0.5 shrink-0">
                            <button
                                onClick={() => setRatingView('bar')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${ratingView === 'bar'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-white'
                                    }`}
                            >
                                Bar
                            </button>
                            <button
                                onClick={() => setRatingView('pie')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${ratingView === 'pie'
                                    ? 'bg-[#22C55E] text-[#0B0F0D]'
                                    : 'text-[#8B948F] hover:text-white'
                                    }`}
                            >
                                Pie
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col justify-center">
                        {ratingView === 'bar' ? (
                            /* Bar View */
                            <div className="space-y-4 max-h-64 sm:max-h-56 overflow-y-auto pr-1.5 custom-scrollbar my-auto">
                                {ratingChartData.entries.map((item, idx) => {
                                    const percent = (item.count / ratingChartData.maxCount) * 100;
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[#F5F7F5] font-medium">{item.label}</span>
                                                <span className="text-[#8B948F] font-semibold">{item.count} games</span>
                                            </div>
                                            <div className="w-full bg-[#0B0F0D] h-3 rounded-full overflow-hidden border border-[#1F2923]">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${Math.max(percent, item.count > 0 ? 5 : 0)}%`,
                                                        backgroundColor: item.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Pie View */
                            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 my-auto h-full">
                                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 my-2 sm:my-0">
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-lg overflow-visible">
                                        {ratingChartData.slices.map((slice, idx) => (
                                            <g key={idx}>
                                                <path
                                                    d={slice.pathData}
                                                    fill={slice.color}
                                                    onMouseEnter={() => setHoveredRatingIndex(idx)}
                                                    onMouseLeave={() => setHoveredRatingIndex(null)}
                                                    className={`transition duration-300 cursor-pointer ${hoveredRatingIndex === idx ? 'opacity-100 filter drop-shadow-md' : 'opacity-90 hover:opacity-100'
                                                        }`}
                                                />
                                                {/* Outer Pointer Line & Callout Label on Hover */}
                                                {hoveredRatingIndex === idx && (
                                                    <g className="pointer-events-none">
                                                        <line
                                                            x1={slice.lineX1}
                                                            y1={slice.lineY1}
                                                            x2={slice.lineX2}
                                                            y2={slice.lineY2}
                                                            stroke={slice.color}
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        />
                                                        <circle cx={slice.lineX2} cy={slice.lineY2} r="1.5" fill={slice.color} />
                                                        <text
                                                            x={slice.textX}
                                                            y={slice.textY}
                                                            textAnchor={slice.textX >= 50 ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            className="transform rotate-90 text-[6.5px] font-extrabold fill-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)]"
                                                            style={{ transformOrigin: `${slice.textX}px ${slice.textY}px` }}
                                                        >
                                                            {slice.label} ({slice.percentage}%)
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                <div className="flex-1 space-y-2 w-full max-h-56 sm:max-h-48 overflow-y-auto pr-1.5 custom-scrollbar my-auto">
                                    {ratingChartData.slices.map((slice, idx) => (
                                        <div
                                            key={idx}
                                            onMouseEnter={() => setHoveredRatingIndex(idx)}
                                            onMouseLeave={() => setHoveredRatingIndex(null)}
                                            className={`flex items-center justify-between text-xs p-1.5 rounded-md transition cursor-pointer ${hoveredRatingIndex === idx ? 'bg-[#1F2923]' : 'hover:bg-[#19211d]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 truncate pr-2">
                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: slice.color }}
                                                />
                                                <span className="text-[#F5F7F5] truncate font-medium">{slice.label}</span>
                                            </div>
                                            <span className="text-[#8B948F] font-medium shrink-0">
                                                {slice.count} ({slice.percentage}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* 3. Line Chart: Reviews by Release Year */}
            <section className="bg-[#131916] border border-[#1F2923] rounded-xl p-5 sm:p-6">
                <h3 className="text-[#F5F7F5] text-base font-semibold mb-1">
                    Timeline Trend
                </h3>
                <p className="text-[#8B948F] text-xs mb-5">
                    Number of games reviewed ordered by release year.
                </p>

                {yearChartData.points.length === 0 ? (
                    <p className="text-[#5A625D] text-xs text-center py-6">
                        No release year data recorded.
                    </p>
                ) : (
                    <div className="relative w-full overflow-x-auto custom-scrollbar pb-2">
                        <div className="min-w-[320px] h-36 relative">
                            <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                                {/* Horizontal grid lines */}
                                <line x1="20" y1="20" x2="280" y2="20" stroke="#1F2923" strokeDasharray="3 3" />
                                <line x1="20" y1="60" x2="280" y2="60" stroke="#1F2923" strokeDasharray="3 3" />
                                <line x1="20" y1="100" x2="280" y2="100" stroke="#1F2923" strokeDasharray="3 3" />

                                {/* Trend line */}
                                <path
                                    d={yearChartData.path}
                                    fill="none"
                                    stroke="#22C55E"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Line Points & Tooltips */}
                                {yearChartData.points.map((p, idx) => (
                                    <g key={idx} className="group cursor-pointer">
                                        <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r="5"
                                            fill="#0B0F0D"
                                            stroke="#22C55E"
                                            strokeWidth="2.5"
                                            className="transition duration-200 group-hover:r-7 group-hover:fill-[#22C55E]"
                                        />
                                        <text
                                            x={p.x}
                                            y={p.y - 9}
                                            textAnchor="middle"
                                            className="fill-[#F5F7F5] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition"
                                        >
                                            {p.count}
                                        </text>
                                        <text
                                            x={p.x}
                                            y="118"
                                            textAnchor="middle"
                                            className="fill-[#8B948F] text-[9px] font-medium"
                                        >
                                            {p.year}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>
                )}
            </section>

            <StatsStoryModal
                show={showStoryModal}
                onClose={() => setShowStoryModal(false)}
                user={currentUser}
                stats={stats}
                reviews={myReviews}
            />
        </div>
    );
}