export const RANKS = [
    {
        name: 'Novice Reviewer',
        min: 0,
        max: 9,
        target: 10,
        color: 'text-slate-200',
        borderColor: 'border-slate-500/60',
        bgColor: 'bg-slate-900/90',
        badgeGradient: 'from-slate-700 to-slate-900',
        icon: '🌱',
        description: 'New reviewer taking first steps into game reviews.',
    },
    {
        name: 'Bronze Gamer',
        min: 10,
        max: 24,
        target: 25,
        color: 'text-amber-300',
        borderColor: 'border-amber-500/70',
        bgColor: 'bg-[#2A170B]',
        badgeGradient: 'from-amber-600 to-amber-950',
        icon: '🥉',
        description: 'Has written 10+ reviews. A rising voice in the community!',
    },
    {
        name: 'Silver Gamer',
        min: 25,
        max: 99,
        target: 100,
        color: 'text-slate-100',
        borderColor: 'border-slate-300/70',
        bgColor: 'bg-[#1E2529]',
        badgeGradient: 'from-slate-400 to-slate-800',
        icon: '🥈',
        description: 'Dedicated critic with 25+ game reviews under their belt.',
    },
    {
        name: 'Gold Gamer',
        min: 100,
        max: 249,
        target: 250,
        color: 'text-yellow-300',
        borderColor: 'border-yellow-400/80',
        bgColor: 'bg-[#2A230B]',
        badgeGradient: 'from-yellow-500 to-amber-800',
        icon: '🥇',
        description: 'Veteran gaming expert with over 100 insightful reviews.',
    },
    {
        name: 'Platinum Gamer',
        min: 250,
        max: 499,
        target: 500,
        color: 'text-cyan-200',
        borderColor: 'border-cyan-400/80',
        bgColor: 'bg-[#0B212A]',
        badgeGradient: 'from-cyan-500 to-blue-950',
        icon: '💎',
        description: 'Elite reviewer with 250+ deep game critiques.',
    },
    {
        name: 'Diamond Master',
        min: 500,
        max: 999,
        target: 1000,
        color: 'text-purple-200',
        borderColor: 'border-purple-400/80',
        bgColor: 'bg-[#1D0B2A]',
        badgeGradient: 'from-purple-500 to-indigo-950',
        icon: '👑',
        description: 'Master gaming connoisseur with 500+ reviews.',
    },
    {
        name: 'Legendary Grandmaster',
        min: 1000,
        max: Infinity,
        target: 1000,
        color: 'text-emerald-300',
        borderColor: 'border-[#22C55E]/80',
        bgColor: 'bg-[#092215]',
        badgeGradient: 'from-[#22C55E] to-emerald-950',
        icon: '⚡',
        description: 'Ultimate Playscore Legend! 1000+ game reviews achieved.',
    },
];

export function getRankInfo(reviewCount = 0) {
    const count = Number(reviewCount) || 0;
    const currentRankIndex = RANKS.findIndex(
        (r) => count >= r.min && count <= r.max
    );
    const index = currentRankIndex !== -1 ? currentRankIndex : RANKS.length - 1;
    const currentRank = RANKS[index];
    const isMax = index === RANKS.length - 1;
    const nextRank = isMax ? null : RANKS[index + 1];

    let progress = 100;
    let reviewsNeeded = 0;
    if (!isMax) {
        const range = currentRank.target - currentRank.min;
        const currentProgress = count - currentRank.min;
        progress = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
        reviewsNeeded = currentRank.target - count;
    }

    return {
        count,
        index,
        currentRank,
        nextRank,
        progress,
        isMax,
        reviewsNeeded,
    };
}
