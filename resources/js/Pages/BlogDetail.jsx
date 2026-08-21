import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function BlogDetail({ id }) {
    const [isLiked, setIsLiked] = useState(false);

    // Mock articles database matching Blog.jsx articles
    const articlesDatabase = {
        1: {
            id: 1,
            title: "Valorant Twitch Streamers Are Gaming The System With 24/7 Streams",
            category: "PC",
            publisher: "KOTAKU",
            publisherLogo: "K",
            publisherBg: "bg-amber-500",
            author: "Alex Morgan",
            readTime: "5 min read",
            date: "24 Aug 2026",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
            tags: ["VALORANT", "Esports", "Twitch", "PC Gaming", "Streaming", "Riot Games"],
            content: [
                {
                    type: "heading",
                    text: "Understanding The 24/7 Drop Farming System"
                },
                {
                    type: "paragraph",
                    text: "Sustainable content streaming doesn't happen by chance. If you take a look at many of Twitch's top Valorant streams right now, you'll notice that they claim to be broadcasting 24/7 drops. Streamers are leveraging pre-recorded VOD loops to keep their channels live perpetually, maximizing drop eligibility for eager beta access key hunters."
                },
                {
                    type: "subheading",
                    text: "Key Streaming Tactics Observed"
                },
                {
                    type: "paragraph",
                    text: "Streaming around the clock requires intentional setup and automated broadcast tools. Channels that scale viewer counts effectively focus on building reliable broadcast loops and clear viewer incentives:"
                },
                {
                    type: "list",
                    items: [
                        "Automated VOD playback loops during off-peak streamer hours",
                        "Clear chat bot notifications regarding drop status and eligibility",
                        "Multi-channel host rotations to preserve viewer engagement",
                        "Standardized overlay badges highlighting active drop rewards",
                        "Structured community rules to prevent spam during high-volume broadcasts"
                    ]
                },
                {
                    type: "subheading",
                    text: "Riot Games & Twitch Policy Enforcement"
                },
                {
                    type: "paragraph",
                    text: "Broadcasting without clear live indicators can lead to channel flags and drop eligibility suspension. Strategic content planning ensures viewer trust while maintaining continuous channel presence:"
                },
                {
                    type: "list",
                    items: [
                        "Enforce strict 'RERUN' tag requirements in broadcast titles",
                        "Monitor chat interaction metrics regularly to satisfy Twitch guidelines",
                        "Strengthen channel moderation against automated farming bots",
                        "Align broadcast schedules with major regional tournament broadcasts"
                    ]
                }
            ]
        },
        2: {
            id: 2,
            title: "Fortnite Features, And Facilities Added In The New Chapter",
            category: "Nintendo Switch",
            publisher: "IGN",
            publisherLogo: "IGN",
            publisherBg: "bg-red-600 text-white",
            author: "Sarah Jenkins",
            readTime: "4 min read",
            date: "18 Feb 2026",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
            tags: ["Fortnite", "Battle Royale", "Nintendo Switch", "Epic Games"],
            content: [
                {
                    type: "heading",
                    text: "New Chapter Island Overview"
                },
                {
                    type: "paragraph",
                    text: "Discover all the latest gameplay updates, island features, and competitive facilities added in the new season. Epic Games has overhauled combat mechanics and mobility options."
                }
            ]
        },
        3: {
            id: 3,
            title: "Guerrilla Games Work At Horizon Zero Dawn Sequel Details Revealed",
            category: "PlayStation",
            publisher: "USGAMER",
            publisherLogo: "USG",
            publisherBg: "bg-[#22C55E]",
            author: "David Chen",
            readTime: "6 min read",
            date: "20 Feb 2026",
            image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
            tags: ["Horizon", "PlayStation 5", "RPG", "Guerrilla Games"],
            content: [
                {
                    type: "heading",
                    text: "Expanding Aloy's Horizon"
                },
                {
                    type: "paragraph",
                    text: "Guerrilla Games continues expanding Aloy's story with groundbreaking next-gen graphics, new underwater exploration mechanics, and lethal robotic machines."
                }
            ]
        }
    };

    const article = articlesDatabase[id] || articlesDatabase[1];

    const relatedArticles = [
        {
            id: 2,
            title: "Fortnite Features, And Facilities",
            date: "18 Feb 2026",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80",
        },
        {
            id: 3,
            title: "Guerrilla Games Work At Horizon Zero Dawn Sequel...",
            date: "17 Feb 2026",
            image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=300&q=80",
        },
        {
            id: 1,
            title: "Valorant Twitch Streamers Are Gaming The System",
            date: "20 Feb 2026",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#F5F7F5] flex flex-col font-sans">
            <Head title={`${article.title} - Playscore Blog`} />

            {/* Top Navigation Bar */}
            <PublicNavbar currentRoute="blog" />

            <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-[#8B948F] mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <Link href={route('welcome')} className="hover:text-white transition">Home</Link>
                    <span>/</span>
                    <Link href={route('blog')} className="hover:text-white transition">Blog</Link>
                    <span>/</span>
                    <span className="text-[#22C55E] font-medium">{article.category}</span>
                </nav>

                {/* Article Header & Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* LEFT COLUMN: Main Article Body */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        {/* Title */}
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            {article.title}
                        </h1>

                        {/* Author & Meta Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1F2923] text-xs text-[#8B948F]">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Author */}
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-bold text-xs flex items-center justify-center border border-[#22C55E]/30">
                                        {article.author.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-white">{article.author}</span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                {/* Category Badge */}
                                <span className="px-2.5 py-1 rounded-md bg-[#131916] border border-[#1F2923] text-[#22C55E] font-semibold">
                                    {article.category}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                {/* Read Time */}
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{article.readTime}</span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                {/* Date */}
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{article.date}</span>
                                </div>
                            </div>

                            {/* Like / Bookmark Heart Button */}
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-xl border transition-all ${
                                    isLiked
                                        ? 'bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E]'
                                        : 'bg-[#131916] border-[#1F2923] text-[#8B948F] hover:text-white hover:border-[#22C55E]/40'
                                }`}
                                aria-label="Bookmark article"
                            >
                                <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Featured Cover Image */}
                        <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1F2923] shadow-2xl bg-[#131916]">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Article Text Content */}
                        <article className="space-y-6 text-[#C9D1CC] text-sm sm:text-base leading-relaxed">
                            {article.content.map((sec, idx) => {
                                if (sec.type === 'heading') {
                                    return (
                                        <h2 key={idx} className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white pt-4 tracking-tight">
                                            {sec.text}
                                        </h2>
                                    );
                                }
                                if (sec.type === 'subheading') {
                                    return (
                                        <h3 key={idx} className="text-lg sm:text-xl font-bold text-white pt-3 tracking-tight">
                                            {sec.text}
                                        </h3>
                                    );
                                }
                                if (sec.type === 'paragraph') {
                                    return <p key={idx} className="text-[#9CA3AF] leading-relaxed">{sec.text}</p>;
                                }
                                if (sec.type === 'list') {
                                    return (
                                        <ul key={idx} className="space-y-2.5 pl-2 my-4">
                                            {sec.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#9CA3AF]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                return null;
                            })}
                        </article>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Widgets (Matching Execora Layout in Playscore Dark Palette) */}
                    <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                        {/* 1. Share on Social Media */}
                        <div className="bg-[#131916] border border-[#1F2923] rounded-2xl p-5 sm:p-6 space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                Share on Social Media
                            </h3>
                            <div className="flex items-center gap-3">
                                {[
                                    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z' },
                                    { name: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                                    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                                    { name: 'LinkedIn', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                                ].map((soc, i) => (
                                    <button
                                        key={i}
                                        className="w-9 h-9 rounded-xl bg-[#161F1A] border border-[#1F2923] flex items-center justify-center text-[#8B948F] hover:text-[#22C55E] hover:border-[#22C55E]/40 transition-all"
                                        title={soc.name}
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d={soc.icon} />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. All Tags Widget */}
                        <div className="bg-[#131916] border border-[#1F2923] rounded-2xl p-5 sm:p-6 space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                All Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 rounded-xl bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] hover:text-white hover:border-[#22C55E]/40 cursor-pointer transition-all"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 3. Related Blogs Widget */}
                        <div className="bg-[#131916] border border-[#1F2923] rounded-2xl p-5 sm:p-6 space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                Related Blogs
                            </h3>
                            <div className="space-y-4">
                                {relatedArticles.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={route('blog.show', rel.id)}
                                        className="flex items-center gap-3.5 group"
                                    >
                                        <img
                                            src={rel.image}
                                            alt={rel.title}
                                            className="w-14 h-14 rounded-xl object-cover bg-[#0B0F0D] border border-[#1F2923] shrink-0 group-hover:scale-105 transition-transform"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1 text-[10px] text-[#8B948F] mb-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{rel.date}</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-white group-hover:text-[#22C55E] transition-colors line-clamp-2 leading-snug">
                                                {rel.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 4. Support Us Widget (Original Centered Coffee Cup Design) */}
                        <div className="rounded-2xl bg-[#131916] border border-[#1F2923] p-6 space-y-6 text-center shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto text-[#22C55E]">
                                <span className="text-xl">☕</span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-[#F5F7F5]">
                                    Support Playscore
                                </h3>
                                <p className="text-xs text-[#8B948F] leading-relaxed max-w-xs mx-auto">
                                    Enjoying our gaming news and articles? Help us keep independent gaming journalism alive and thriving.
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <a
                                    href="https://trakteer.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-[#C1272D] hover:bg-[#A81F24] text-white shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Support on Trakteer</span>
                                </a>
                                <a
                                    href="https://saweria.co"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-[#E5A93C] hover:bg-[#D4982B] text-[#0B0F0D] shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Support on Saweria</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
