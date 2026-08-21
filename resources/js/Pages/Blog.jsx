import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Blog({ dbArticles = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const categories = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch'];

    // 9 Real Curated Indonesian Gaming & Esports News Articles
    const mockArticles = [
        {
            id: 101,
            title: "Rockstar Siapkan 'GTA VI: An Extended Look' Tayang Perdana di Netflix Akhir Agustus 2026",
            description: "Rockstar Games mengonfirmasi penayangan perdana trailer gameplay mendalam GTA 6 yang memperlihatkan peta Leonida dan aksi Lucia & Jason secara eksklusif...",
            publisher: "Medcom.id",
            publisherBg: "bg-red-600 text-white",
            category: "PlayStation",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
            tags: ["#GTA6", "#RockstarGames", "#BeritaGame", "#PS5"],
        },
        {
            id: 102,
            title: "MPL ID Season 18 Resmi Dimulai: Babak Playoffs Siap Digelar di Surabaya Jawa Timur",
            description: "Kompetisi teratas Mobile Legends Indonesia resmi bergulir. Musim ini membawa pertarungan sengit antar tim pro menuju trofi juara di Surabaya...",
            publisher: "Detik.com",
            publisherBg: "bg-blue-600 text-white",
            category: "PC",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
            tags: ["#MPLID", "#MobileLegends", "#EsportsIndonesia", "#MLBB"],
        },
        {
            id: 103,
            title: "Monster Hunter Wilds Patch Update Ver.1.042 Hadirkan Optimalisasi Framerate Raid Multiplayer",
            description: "Capcom merilis pembaruan performa besar untuk PC dan konsol guna mengatasi masalah performa saat berburu monster raksasa secara co-op...",
            publisher: "Duniagames",
            publisherBg: "bg-amber-500 text-black",
            category: "PC",
            image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80",
            tags: ["#MonsterHunterWilds", "#Capcom", "#PCGaming"],
        },
        {
            id: 104,
            title: "Game Lokal Indonesia 'Riftstorm' dan 'Montabi' Resmi Rilis Global di Steam",
            description: "Developer game asal Indonesia kembali unjuk gigi di kancah internasional dengan meluncurkan game roguelite action dan petualangan terbaru di Steam...",
            publisher: "Medcom.id",
            publisherBg: "bg-red-600 text-white",
            category: "PC",
            image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
            tags: ["#GameLokal", "#GameIndonesia", "#Steam", "#IndieGame"],
        },
        {
            id: 105,
            title: "PMPL ID Fall 2026 Memasuki Minggu Penentuan Menuju Panggung PMGC Turki",
            description: "Tim-tim esports PUBG Mobile terbaik Indonesia saling sikut memperebutkan tiket puncak menuju kejuaraan dunia PMGC 2026...",
            publisher: "Detik.com",
            publisherBg: "bg-blue-600 text-white",
            category: "PC",
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
            tags: ["#PMPLID", "#PUBGMobile", "#Esports", "#PMGC2026"],
        },
        {
            id: 106,
            title: "Elden Ring: Tarnished Edition Diumumkan untuk Peluncuran Nintendo Switch 2",
            description: "FromSoftware menghadirkan paket komplit game RPG terbaiknya beserta ekspansi Shadow of the Erdtree untuk konsol handheld generasi terbaru...",
            publisher: "Duniagames",
            publisherBg: "bg-amber-500 text-black",
            category: "Nintendo Switch",
            image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
            tags: ["#EldenRing", "#Switch2", "#FromSoftware", "#RPG"],
        },
        {
            id: 107,
            title: "Valorant Season 2026 Act 5 Rilis Skin Bundle 'Aeris' dan Kembalinya Map Abyss",
            description: "Riot Games memberikan pembaruan besar untuk skena kompetitif Valorant dengan rotasi map anyar serta jajaran skin eksklusif terbaru...",
            publisher: "Medcom.id",
            publisherBg: "bg-red-600 text-white",
            category: "PC",
            image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
            tags: ["#VALORANT", "#RiotGames", "#TacticalShooter", "#Esports"],
        },
        {
            id: 108,
            title: "Metal Gear Solid: Master Collection Vol. 2 Rilis 27 Agustus, Bawa MGS4 dan Peace Walker",
            description: "Konami memboyong seri legendaris Metal Gear Solid 4 dan Peace Walker HD ke platform konsol modern dan PC dengan peningkatan grafis...",
            publisher: "Detik.com",
            publisherBg: "bg-blue-600 text-white",
            category: "PlayStation",
            image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80",
            tags: ["#MetalGearSolid", "#Konami", "#MGS4", "#PS5"],
        },
        {
            id: 109,
            title: "CD Projekt Red Umumkan Pembangunan Penuh Sekuel Cyberpunk 2077 'Codename Orion'",
            description: "Studio CD Projekt Red resmi membuka studio pengembang di Boston untuk menggarap sekuel Cyberpunk berbasis Unreal Engine 5...",
            publisher: "Duniagames",
            publisherBg: "bg-amber-500 text-black",
            category: "Xbox",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
            tags: ["#CyberpunkOrion", "#CDPR", "#UnrealEngine5", "#GamingNews"],
        },
    ];

    // Formatted database articles with timestamp & tags
    const formattedDbArticles = dbArticles.map((art) => ({
        id: art.id,
        title: art.title,
        description: art.content ? art.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : '',
        category: art.category || 'PC',
        publisher: art.publisher || 'Playscore',
        publisherLogo: art.publisher_logo || art.publisher?.[0] || 'P',
        publisherBg: art.publisher_bg || 'bg-[#22C55E]',
        image: art.cover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        created_at: art.created_at ? new Date(art.created_at) : new Date(),
        tags: art.tags || ['#Gaming', '#News'],
    }));

    // Combined all available articles pool (Formatted DB articles first + mock articles)
    const allPoolArticles = useMemo(() => {
        const mockFormatted = mockArticles.map((m, idx) => ({
            ...m,
            publisherLogo: m.publisher?.[0] || 'P',
            // Assign recent dates within last 30 days for mock items
            created_at: new Date(Date.now() - (idx * 2 * 86400000)),
            tags: ['#Gaming', '#News'],
        }));
        return [...formattedDbArticles, ...mockFormatted];
    }, [dbArticles]);

    // 1. Pick Recommended Articles (1 Hero + 2 Side) randomly from recent articles (within last 30 days)
    const { heroArticle, sideArticles, recommendedIds } = useMemo(() => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        // Filter articles created within last 30 days
        let recentPool = allPoolArticles.filter(art => art.created_at >= thirtyDaysAgo);
        
        // Fallback to all articles if recent pool is too small
        if (recentPool.length < 3) {
            recentPool = [...allPoolArticles];
        }

        // Shuffle recent pool randomly
        const shuffled = [...recentPool].sort(() => 0.5 - Math.random());

        const hero = shuffled[0] || allPoolArticles[0];
        const side = shuffled.slice(1, 3);
        const recIds = new Set([hero.id, ...side.map(s => s.id)]);

        return {
            heroArticle: hero,
            sideArticles: side,
            recommendedIds: recIds,
        };
    }, [allPoolArticles]);

    // 2. What's New Articles (Excluded articles in Recommended, sorted latest first)
    const whatsNewArticles = useMemo(() => {
        return allPoolArticles
            .filter((art) => !recommendedIds.has(art.id))
            .sort((a, b) => b.created_at - a.created_at);
    }, [allPoolArticles, recommendedIds]);

    // Filter What's New articles based on selected category & search query
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

            <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-7 sm:space-y-12">
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
                        <Link
                            href={route('blog.show', heroArticle.id)}
                            className="flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-auto md:col-span-8 group relative rounded-2xl overflow-hidden bg-[#131916] border border-[#1F2923] shadow-2xl flex flex-col justify-end min-h-[390px] md:min-h-[380px] lg:min-h-[440px] snap-start"
                        >
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
                        </Link>

                        {/* Side Stack Articles (Horizontal on Mobile, Vertical Stack on Desktop) */}
                        <div className="flex md:flex-col md:col-span-4 gap-5 lg:gap-6 flex-shrink-0 md:flex-shrink">
                            {sideArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={route('blog.show', article.id)}
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
                                </Link>
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
                                    <Link
                                        key={article.id}
                                        href={route('blog.show', article.id)}
                                        className="group rounded-2xl bg-[#131916] hover:bg-[#161F1A] border border-[#1F2923] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#22C55E]/30 flex flex-col sm:flex-row items-center sm:min-h-[190px]"
                                    >
                                        {/* Article Thumbnail (Fixed Height with padding/margins to match card cleanly) */}
                                        <div className="w-full sm:w-56 h-48 sm:h-[190px] flex-shrink-0 relative overflow-hidden bg-[#0B0F0D]">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Article Details */}
                                        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between overflow-hidden self-stretch">
                                            <div className="space-y-2 min-w-0">
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
                                            </div>

                                            {/* Publisher & Metadata */}
                                            <div className="flex items-center gap-2 pt-3 border-t border-[#1F2923]/60 mt-3 shrink-0">
                                                <span className={`w-4 h-4 rounded text-[9px] font-black text-[#0B0F0D] flex items-center justify-center ${article.publisherBg}`}>
                                                    {article.publisher[0]}
                                                </span>
                                                <span className="text-[11px] font-bold text-[#F5F7F5] tracking-wider">
                                                    {article.publisher}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
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

                        {/* Right Sidebar Widget: Popular Platforms (Visible only on PC Desktop lg+) */}
                        <div className="hidden lg:block lg:col-span-4">
                            <div className="sticky top-24 rounded-2xl bg-[#131916] border border-[#1F2923] p-6 space-y-4 shadow-xl">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                    Popular Platforms
                                </h3>
                                <p className="text-xs text-[#8B948F] leading-relaxed">
                                    Filter gaming news by your favorite hardware ecosystem:
                                </p>

                                <div className="space-y-2 pt-1">
                                    {[
                                        { name: 'PC Gaming', count: '142 Articles', color: 'bg-amber-500' },
                                        { name: 'PlayStation', count: '98 Articles', color: 'bg-blue-600' },
                                        { name: 'Xbox Series X', count: '76 Articles', color: 'bg-green-600' },
                                        { name: 'Nintendo Switch', count: '54 Articles', color: 'bg-red-500' },
                                    ].map((plat, i) => (
                                        <div
                                            key={i}
                                            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#161F1A] border border-[#1F2923] hover:border-[#22C55E]/60 text-xs font-semibold text-[#F5F7F5] hover:text-[#22C55E] transition-all group cursor-default"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className={`w-2 h-2 rounded-full ${plat.color}`} />
                                                <span>{plat.name}</span>
                                            </div>
                                            <span className="text-[10px] text-[#8B948F] group-hover:text-[#22C55E] font-medium transition-colors">
                                                {plat.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
