import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';

export default function Blog() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const categories = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch'];

    // Recommended Articles Mock Data
    const heroArticle = {
        id: 1,
        title: "Valorant Twitch Streamers Are Gaming The System With 24/7 Streams That Back Up Viewers Desperate For Beta Keys",
        description: "If you take a look at many of Twitch's top Valorant streams right now, you'll notice that they claim to be running 24/7...",
        publisher: "KOTAKU",
        publisherLogo: "K",
        publisherBg: "bg-amber-500",
        category: "PC",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        tagImage: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=400&q=80",
    };

    const sideArticles = [
        {
            id: 2,
            title: "Fortnite Features, And Facilities",
            description: "Discover all the latest gameplay updates, island features, and competitive facilities added in the new season...",
            publisher: "IGN",
            category: "Nintendo Switch",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 3,
            title: "Guerrilla Games Work At Horizon Zero Dawn Sequel...",
            description: "Guerrilla Games continues expanding Aloy's story with groundbreaking next-gen graphics and new machines...",
            publisher: "USGAMER",
            category: "PlayStation",
            image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
        },
    ];

    // Expanded What's New Articles Mock Data for Pagination & Search Testing
    const whatsNewArticles = [
        {
            id: 101,
            title: "Two Destiny 2 Exotics Disabled Due To Exploits--Again",
            description: "If you've been enjoying the increased melee damage associated with certain Exotic gauntlets in Destiny 2, we have some very...",
            publisher: "KOTAKU",
            publisherBg: "bg-amber-500",
            category: "PC",
            image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 102,
            title: "Fortnite Chapter 2: Season 2 Extended Until June",
            description: "Epic has announced that Fortnite Chapter 2: Season 2 has been extended until June.",
            publisher: "IGN",
            publisherBg: "bg-red-500",
            category: "Nintendo Switch",
            image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 103,
            title: "Ghost Of Tsushima Won't Have Waypoints",
            description: "You're just gonna have to figure it out.",
            publisher: "USGAMER",
            publisherBg: "bg-sky-500",
            category: "PlayStation",
            image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 104,
            title: "Industries Of Titan Lets You Build The Gloomy Cyberpunk City Of Your Dreams",
            description: "Depending on what sort of mood you're in, Industries of Titan could be one to watch for or something to obsessively sink into...",
            publisher: "DESTRUCTOID",
            publisherBg: "bg-emerald-500",
            category: "PC",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 105,
            title: "Infinity Ward Cracks Down On Cheaters In Modern Warfare And Warzone",
            description: "Hackers will now be going head-to-head in Call of Duty: Modern Warfare and Warzone, according to new details Infinity Ward revealed about combating cheaters...",
            publisher: "KOTAKU",
            publisherBg: "bg-amber-500",
            category: "Xbox",
            image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 106,
            title: "Cyberpunk 2077 Night City Wire Episode Revealed",
            description: "CD Projekt Red announces a special broadcast event delving deeper into the lore and mechanics of Cyberpunk 2077...",
            publisher: "IGN",
            publisherBg: "bg-red-500",
            category: "PC",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 107,
            title: "PlayStation 5 Showcase: Everything Announced",
            description: "Sony revealed groundbreaking first-party titles, hardware details, and upcoming exclusive games for PS5...",
            publisher: "USGAMER",
            publisherBg: "bg-sky-500",
            category: "PlayStation",
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 108,
            title: "Xbox Game Pass Adds Major AAA Franchises",
            description: "Microsoft expands its subscription catalog with critically acclaimed titles available day one for console and PC members...",
            publisher: "DESTRUCTOID",
            publisherBg: "bg-emerald-500",
            category: "Xbox",
            image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 109,
            title: "The Legend of Zelda: Tears of the Kingdom Gameplay Breakdown",
            description: "Nintendo shows off new building mechanics and sky island exploration features coming in the next Zelda installment...",
            publisher: "IGN",
            publisherBg: "bg-red-500",
            category: "Nintendo Switch",
            image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 110,
            title: "Elden Ring DLC Shadow of the Erdtree Teased",
            description: "FromSoftware officially unveils expansion plans for its award-winning action RPG Elden Ring...",
            publisher: "KOTAKU",
            publisherBg: "bg-amber-500",
            category: "PC",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 111,
            title: "Hollow Knight: Silksong New Gameplay Impressions",
            description: "Team Cherry gives a fresh look at Hornet's agile moveset and intricate world design in Silksong...",
            publisher: "DESTRUCTOID",
            publisherBg: "bg-emerald-500",
            category: "Nintendo Switch",
            image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 112,
            title: "Starfield Constellation Edition Announced",
            description: "Bethesda reveals collector details, ship customization preview, and release timeline for Starfield...",
            publisher: "USGAMER",
            publisherBg: "bg-sky-500",
            category: "Xbox",
            image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 113,
            title: "Final Fantasy XVI Demo Released Worldwide",
            description: "Square Enix releases the prologue demo for PS5 users, allowing players to carry save progress over...",
            publisher: "IGN",
            publisherBg: "bg-red-500",
            category: "PlayStation",
            image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 114,
            title: "Overwatch 2 Hero Reworks Detailed",
            description: "Blizzard outlines massive balance shifts, new map layouts, and competitive ranked system overhauls...",
            publisher: "KOTAKU",
            publisherBg: "bg-amber-500",
            category: "PC",
            image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 115,
            title: "Metroid Prime Remastered Launches Digitally",
            description: "Samus Aran's iconic GameCube adventure gets a stunning high-definition visual remaster on Nintendo Switch...",
            publisher: "DESTRUCTOID",
            publisherBg: "bg-emerald-500",
            category: "Nintendo Switch",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        },
    ];

    // Filter articles based on selected category & search query
    const filteredArticles = whatsNewArticles.filter(art => {
        const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.publisher.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination Calculation
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#F5F7F5] font-sans flex flex-col selection:bg-[#22C55E] selection:text-[#0B0F0D]">
            <Head title="Blog - Playscore" />

            <PublicNavbar currentRoute="blog" />

            <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-7 sm:space-y-12">
                {/* ================= RECOMMENDED ARTICLES ================= */}
                <section>
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F7F5]">
                            Recommended Articles
                        </h2>
                    </div>

                    {/* Mobile Horizontal Scroll Slider / Desktop Grid */}
                    <div className="flex md:grid md:grid-cols-12 gap-5 lg:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
                        {/* Featured Hero Card */}
                        <div className="flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-auto md:col-span-8 group relative rounded-2xl overflow-hidden bg-[#131916] border border-[#1F2923] shadow-2xl flex flex-col justify-end min-h-[390px] md:min-h-[380px] lg:min-h-[440px] snap-start">
                            {/* Background Image */}
                            <img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/60 to-transparent" />

                            {/* Top Left Publisher Pill */}
                            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#0B0F0D]/80 backdrop-blur-md border border-[#1F2923] text-xs font-medium">
                                <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center font-bold text-[9px] sm:text-[10px] text-[#0B0F0D] ${heroArticle.publisherBg}`}>
                                    {heroArticle.publisherLogo}
                                </span>
                                <span className="font-semibold text-[#F5F7F5] tracking-wider text-[10px] sm:text-[11px]">
                                    {heroArticle.publisher}
                                </span>
                            </div>

                            {/* Hero Card Content */}
                            <div className="relative z-10 p-5 sm:p-6 lg:p-8">
                                <div className="space-y-1.5 md:space-y-2 max-w-3xl">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold leading-snug text-[#F5F7F5] group-hover:text-[#22C55E] transition-colors line-clamp-2">
                                        {heroArticle.title}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-[#8B948F] line-clamp-2 leading-relaxed">
                                        {heroArticle.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Side Stack Articles (Horizontal on Mobile, Vertical Stack on Desktop) */}
                        <div className="flex md:flex-col md:col-span-4 gap-5 lg:gap-6 flex-shrink-0 md:flex-shrink">
                            {sideArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className="flex-shrink-0 w-[80vw] sm:w-[70vw] md:w-auto group relative rounded-2xl overflow-hidden bg-[#131916] border border-[#1F2923] shadow-lg md:flex-1 min-h-[260px] md:min-h-[170px] lg:min-h-[190px] flex flex-col justify-end p-4 md:p-5 snap-start"
                                >
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/40 to-transparent" />

                                    {/* Top Left Publisher Pill */}
                                    <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex items-center gap-2 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-[#0B0F0D]/80 backdrop-blur-md border border-[#1F2923] text-[9px] md:text-[10px]">
                                        <span className="font-semibold text-[#F5F7F5]">{article.publisher}</span>
                                    </div>

                                    <div className="relative z-10 space-y-1.5">
                                        <h4 className="text-sm md:text-base lg:text-lg font-bold text-[#F5F7F5] group-hover:text-[#22C55E] transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h4>
                                        <p className="md:hidden text-xs text-[#8B948F] line-clamp-2 leading-relaxed">
                                            {article.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= WHAT'S NEW SECTION ================= */}
                <section>
                    {/* Header Controls, Search Bar & Category Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1F2923]">
                        {/* Left Side: What's New Heading & Search Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F7F5] whitespace-nowrap">
                                What's New
                            </h2>

                            {/* Search Form Bar */}
                            <div className="relative w-full sm:w-64 md:w-72">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B948F]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search articles, news..."
                                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#8B948F] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B948F] hover:text-white"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Category Filter Pills (Per Platform) */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                                            ? 'bg-[#22C55E] text-[#0B0F0D] shadow-md shadow-[#22C55E]/20'
                                            : 'bg-[#131916] text-[#8B948F] border border-[#1F2923] hover:text-[#F5F7F5] hover:border-[#22C55E]/40'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid (Articles List + Sidebar) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Articles List (Left - 8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {paginatedArticles.length > 0 ? (
                                paginatedArticles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="group rounded-2xl bg-[#131916] hover:bg-[#161F1A] border border-[#1F2923] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#22C55E]/30 flex flex-col sm:flex-row items-stretch sm:h-44"
                                    >
                                        {/* Article Thumbnail (Fixed Height Flush) */}
                                        <div className="w-full sm:w-52 h-44 sm:h-full flex-shrink-0 relative overflow-hidden bg-[#0B0F0D]">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Article Details */}
                                        <div className="flex-1 p-5 space-y-2 flex flex-col justify-center">
                                            {/* Category Tag */}
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#161F1A] text-[#22C55E] border border-[#22C55E]/20">
                                                    {article.category}
                                                </span>
                                            </div>

                                            <h3 className="text-base sm:text-lg font-bold text-[#F5F7F5] group-hover:text-[#22C55E] transition-colors leading-snug line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="text-xs text-[#8B948F] line-clamp-2 leading-relaxed">
                                                {article.description}
                                            </p>

                                            {/* Publisher & Metadata */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className={`w-4 h-4 rounded text-[9px] font-black text-[#0B0F0D] flex items-center justify-center ${article.publisherBg}`}>
                                                    {article.publisher[0]}
                                                </span>
                                                <span className="text-[11px] font-bold text-[#F5F7F5] tracking-wider">
                                                    {article.publisher}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-[#131916] rounded-2xl border border-[#1F2923] space-y-2">
                                    <p className="text-[#F5F7F5] font-semibold text-base">No articles found</p>
                                    <p className="text-[#8B948F] text-xs">
                                        Try adjusting your search query or category filter.
                                    </p>
                                </div>
                            )}

                            {/* Pagination Controls (5 Items Per Page Max) */}
                            {totalPages > 1 && (
                                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1F2923]">
                                    <p className="text-xs text-[#8B948F] text-center sm:text-left">
                                        Showing <span className="font-semibold text-white">{startIndex + 1}</span> to{' '}
                                        <span className="font-semibold text-white">
                                            {Math.min(startIndex + itemsPerPage, filteredArticles.length)}
                                        </span>{' '}
                                        of <span className="font-semibold text-white">{filteredArticles.length}</span> articles
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#131916] border border-[#1F2923] text-[#8B948F] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${currentPage === page
                                                            ? 'bg-[#22C55E] text-[#0B0F0D]'
                                                            : 'bg-[#131916] text-[#8B948F] border border-[#1F2923] hover:text-white'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#131916] border border-[#1F2923] text-[#8B948F] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar - Support Us Widget (Right - 4 cols) */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 rounded-2xl bg-[#131916] border border-[#1F2923] p-6 sm:p-8 space-y-6 text-center shadow-xl">
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
                </section>
            </main>
        </div>
    );
}
