import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function BlogDetail({ id, dbArticle = null, dbArticles = [] }) {
    const [isLiked, setIsLiked] = useState(false);

    // Mock articles database for Indonesian Gaming News (IDs 101 - 109)
    const articlesDatabase = {
        101: {
            id: 101,
            title: "Rockstar Siapkan 'GTA VI: An Extended Look' Tayang Perdana di Netflix Akhir Agustus 2026",
            category: "PlayStation",
            publisher: "Medcom.id",
            publisherLogo: "M",
            publisherBg: "bg-red-600 text-white",
            author: "Tim Redaksi Medcom",
            readTime: "5 min read",
            date: "21 Aug 2026",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
            tags: ["#GTA6", "#RockstarGames", "#BeritaGame", "#PS5"],
            sources: [
                { name: "medcom.id", url: "https://www.medcom.id/teknologi/game/GKdErY4N-rockstar-siapkan-gta-vi" },
                { name: "rockstargames.com", url: "https://www.rockstargames.com/gta-v" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Sajian Spesial Gameplay Mendalam Lucia & Jason"
                },
                {
                    type: "paragraph",
                    text: "Rockstar Games secara resmi mengonfirmasi peluncuran program siaran khusus bertajuk 'Grand Theft Auto VI: An Extended Look' yang disiarkan secara global akhir Agustus 2026. Siaran ini disiarkan secara perdana eksklusif melalui platform Netflix sebelum kemudian diunggah di saluran YouTube resmi Rockstar."
                },
                {
                    type: "subheading",
                    text: "Fitur Utama yang Akan Dipamerkan"
                },
                {
                    type: "paragraph",
                    text: "Para penggemar yang telah lama menantikan kelanjutan franchse ini akan disuguhi dengan tampilan mendetail mengenai dunia bagian Leonida, fisika kendaraan teranyar, serta interaksi NPC bertenaga AI:"
                },
                {
                    type: "list",
                    items: [
                        "Mekanisme dual-protagonist Lucia dan Jason dalam misi perampokan dinamis",
                        "Ekosistem wilayah Leonida yang luas mulai dari Vice City hingga rawa Vice Dale",
                        "Peningkatan sistem kecerdasan buatan (AI) pada lalu lintas dan warga kota",
                        "Fitur simulasi media sosial in-game yang saling terhubung dengan alur cerita"
                    ]
                }
            ]
        },
        102: {
            id: 102,
            title: "MPL ID Season 18 Resmi Dimulai: Babak Playoffs Siap Digelar di Surabaya Jawa Timur",
            category: "PC",
            publisher: "Detik.com",
            publisherLogo: "D",
            publisherBg: "bg-blue-600 text-white",
            author: "Budi Santoso",
            readTime: "4 min read",
            date: "20 Aug 2026",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
            tags: ["#MPLID", "#MobileLegends", "#EsportsIndonesia", "#MLBB"],
            sources: [
                { name: "detik.com", url: "https://inet.detik.com/game-esport/d-mpl-id-season-18" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Road to Surabaya: Panggung Baru Mobile Legends Indonesia"
                },
                {
                    type: "paragraph",
                    text: "Kompetisi Mobile Legends: Bang Bang Professional League Indonesia (MPL ID) Season 18 resmi menghentak panggung esports tanah air. Musim ini mencatatkan sejarah baru dengan memboyong perhelatan puncak Babak Playoffs ke kota Surabaya, Jawa Timur."
                },
                {
                    type: "subheading",
                    text: "Sorotan Tim & Persaingan Musim Ini"
                },
                {
                    type: "paragraph",
                    text: "Sembilan tim franchse teratas siap memperebutkan tahta tertinggi dan tiket menuju kualifikasi kejuaraan dunia M-Series:"
                },
                {
                    type: "list",
                    items: [
                        "Perombakan roster besar-besaran dari tim papan atas",
                        "Hadirnya deretan pemain muda berbakat dari skena MDL Indonesia",
                        "Penerapan patch sistem emblem dan talent terbaru dari Moonton",
                        "Venue Playoffs megah di Surabaya dengan kapasitas ribuan penonton"
                    ]
                }
            ]
        },
        103: {
            id: 103,
            title: "Monster Hunter Wilds Patch Update Ver.1.042 Hadirkan Optimalisasi Framerate Raid Multiplayer",
            category: "PC",
            publisher: "Duniagames",
            publisherLogo: "DG",
            publisherBg: "bg-amber-500 text-black",
            author: "Rizky Pratama",
            readTime: "5 min read",
            date: "19 Aug 2026",
            image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=1200&q=80",
            tags: ["#MonsterHunterWilds", "#Capcom", "#PCGaming"],
            sources: [
                { name: "duniagames.co.id", url: "https://duniagames.co.id/news/monster-hunter-wilds-update" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Solusi Stabilitas Performa untuk Hunter PC & Konsol"
                },
                {
                    type: "paragraph",
                    text: "Capcom merilis patch perbaikan berkode Ver.1.042 untuk Monster Hunter Wilds. Update ini difokuskan pada peningkatan kestabilan FPS saat sesi perburuan multiplayer 4 pemain serta penyesuaian damage senjata Great Sword dan Charge Blade."
                }
            ]
        },
        104: {
            id: 104,
            title: "Game Lokal Indonesia 'Riftstorm' dan 'Montabi' Resmi Rilis Global di Steam",
            category: "PC",
            publisher: "Medcom.id",
            publisherLogo: "M",
            publisherBg: "bg-red-600 text-white",
            author: "Dewi Lestari",
            readTime: "6 min read",
            date: "18 Aug 2026",
            image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
            tags: ["#GameLokal", "#GameIndonesia", "#Steam", "#IndieGame"],
            sources: [
                { name: "medcom.id", url: "https://www.medcom.id/teknologi/game/riftstorm-montabi-rilis" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Karya Anak Bangsa Unjuk Gigi di Skena Global"
                },
                {
                    type: "paragraph",
                    text: "Industri game tanah air kembali mengukir prestasi manis. Dua game buatan developer lokal Indonesia, yaitu 'Riftstorm' (co-op multiplayer roguelite) dan 'Montabi' (petualangan RPG monster taming), resmi dirilis secara global melalui platform Steam."
                }
            ]
        },
        105: {
            id: 105,
            title: "PMPL ID Fall 2026 Memasuki Minggu Penentuan Menuju Panggung PMGC Turki",
            category: "PC",
            publisher: "Detik.com",
            publisherLogo: "D",
            publisherBg: "bg-blue-600 text-white",
            author: "Budi Santoso",
            readTime: "4 min read",
            date: "17 Aug 2026",
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
            tags: ["#PMPLID", "#PUBGMobile", "#Esports", "#PMGC2026"],
            sources: [
                { name: "detik.com", url: "https://inet.detik.com/game-esport/pmpl-id-fall-2026" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Pertarungan Sengit Rebut Tiket Kejuaraan Dunia"
                },
                {
                    type: "paragraph",
                    text: "Kompetisi PUBG Mobile Pro League Indonesia (PMPL ID) Fall 2026 telah memasuki pekan penentuan. 16 tim esports teratas Indonesia saling adu strategi dan ketajaman aim demi mengamankan slot menuju ajang PUBG Mobile Global Championship (PMGC) 2026 di Turki."
                }
            ]
        },
        106: {
            id: 106,
            title: "Elden Ring: Tarnished Edition Diumumkan untuk Peluncuran Nintendo Switch 2",
            category: "Nintendo Switch",
            publisher: "Duniagames",
            publisherLogo: "DG",
            publisherBg: "bg-amber-500 text-black",
            author: "Rizky Pratama",
            readTime: "5 min read",
            date: "16 Aug 2026",
            image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
            tags: ["#EldenRing", "#Switch2", "#FromSoftware", "#RPG"],
            sources: [
                { name: "duniagames.co.id", url: "https://duniagames.co.id/news/elden-ring-tarnished-edition-switch-2" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Lands Between Kini Bisa Dimainkan di Handheld Next-Gen"
                },
                {
                    type: "paragraph",
                    text: "FromSoftware mengumumkan edisi khusus 'Elden Ring: Tarnished Edition' untuk konsol Nintendo Switch 2. Paket ini mengemas game utama lengkap bersama seluruh konten DLC ekspansi Shadow of the Erdtree."
                }
            ]
        },
        107: {
            id: 107,
            title: "Valorant Season 2026 Act 5 Rilis Skin Bundle 'Aeris' dan Kembalinya Map Abyss",
            category: "PC",
            publisher: "Medcom.id",
            publisherLogo: "M",
            publisherBg: "bg-red-600 text-white",
            author: "Tim Redaksi Medcom",
            readTime: "4 min read",
            date: "15 Aug 2026",
            image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80",
            tags: ["#VALORANT", "#RiotGames", "#TacticalShooter", "#Esports"],
            sources: [
                { name: "medcom.id", url: "https://www.medcom.id/teknologi/game/valorant-act-5-aeris" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Babak Baru Kompetitif Tactical Shooter Riot Games"
                },
                {
                    type: "paragraph",
                    text: "Riot Games meluncurkan update Season 2026 Act 5 untuk game shooter taktis Valorant. Update ini membawa lini skin futuristik 'Aeris', reset rank season, serta membawa kembali map 'Abyss' ke dalam rotasi match competitive."
                }
            ]
        },
        108: {
            id: 108,
            title: "Metal Gear Solid: Master Collection Vol. 2 Rilis 27 Agustus, Bawa MGS4 dan Peace Walker",
            category: "PlayStation",
            publisher: "Detik.com",
            publisherLogo: "D",
            publisherBg: "bg-blue-600 text-white",
            author: "Budi Santoso",
            readTime: "5 min read",
            date: "14 Aug 2026",
            image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1200&q=80",
            tags: ["#MetalGearSolid", "#Konami", "#MGS4", "#PS5"],
            sources: [
                { name: "detik.com", url: "https://inet.detik.com/game-esport/metal-gear-solid-collection-vol-2" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Reuni dengan Solid Snake dan Big Boss di Konsol Modern"
                },
                {
                    type: "paragraph",
                    text: "Konami merilis Metal Gear Solid: Master Collection Vol. 2 secara resmi di platform PS5, Xbox, dan PC. Koleksi ini menghadirkan kembali judul legendaris Metal Gear Solid 4: Guns of the Patriots dan Peace Walker HD."
                }
            ]
        },
        109: {
            id: 109,
            title: "CD Projekt Red Umumkan Pembangunan Penuh Sekuel Cyberpunk 2077 'Codename Orion'",
            category: "Xbox",
            publisher: "Duniagames",
            publisherLogo: "DG",
            publisherBg: "bg-amber-500 text-black",
            author: "Rizky Pratama",
            readTime: "6 min read",
            date: "13 Aug 2026",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
            tags: ["#CyberpunkOrion", "#CDPR", "#UnrealEngine5", "#GamingNews"],
            sources: [
                { name: "duniagames.co.id", url: "https://duniagames.co.id/news/cd-projekt-red-cyberpunk-orion" }
            ],
            content: [
                {
                    type: "heading",
                    text: "Ekspansi Dunia Cyberpunk Menggunakan Unreal Engine 5"
                },
                {
                    type: "paragraph",
                    text: "CD Projekt Red meresmikan pembukaan studio Boston untuk memimpin proyek pengembangan sekuel Cyberpunk 2077 bertajuk 'Orion'. Game ini dikembangkan memanfaatkan teknologi Unreal Engine 5 untuk menghadirkan visual Night City yang kian realistis."
                }
            ]
        }
    };

    // Current Article Data
    const article = dbArticle
        ? {
            id: dbArticle.id,
            title: dbArticle.title,
            category: dbArticle.category || 'PC',
            publisher: dbArticle.publisher || 'Playscore',
            publisherLogo: dbArticle.publisher_logo || dbArticle.publisher?.[0] || 'P',
            publisherBg: dbArticle.publisher_bg || 'bg-[#22C55E]',
            author: dbArticle.author || 'Admin',
            readTime: dbArticle.read_time || '5 min read',
            date: new Date(dbArticle.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            image: dbArticle.cover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
            tags: dbArticle.tags || ['#Gaming', '#News'],
            content: []
        }
        : (articlesDatabase[id] || articlesDatabase[1]);

    // Build articles pool for related matching
    const allArticlesPool = useMemo(() => {
        const dbList = dbArticles.map((art) => ({
            id: art.id,
            title: art.title,
            category: art.category || 'PC',
            publisher: art.publisher || 'Playscore',
            date: art.created_at ? new Date(art.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
            image: art.cover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            tags: art.tags || ['#Gaming', '#News'],
        }));

        const mockList = [
            {
                id: 101,
                title: "GTA VI Extended Look Stream Announced on Netflix for Late August",
                category: "PlayStation",
                publisher: "IGN",
                date: "21 Aug 2026",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
                tags: ["#GTA6", "#RockstarGames", "#PS5"],
            },
            {
                id: 102,
                title: "Monster Hunter Wilds Ver.1.042 Update Fixes Performance Drops & Weapon Balance",
                category: "PC",
                publisher: "KOTAKU",
                date: "20 Aug 2026",
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
                tags: ["#MonsterHunterWilds", "#Capcom", "#PCGaming"],
            },
            {
                id: 103,
                title: "Valorant Season 2026 Act 5 Brings New 'Aeris' Skin Bundle & Abyss Map Return",
                category: "PC",
                publisher: "DESTRUCTOID",
                date: "18 Aug 2026",
                image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80",
                tags: ["#VALORANT", "#RiotGames", "#Esports"],
            },
            {
                id: 104,
                title: "The Witcher 3: Songs of the Past Expansion Announced as Prequel Prologue to Witcher 4",
                category: "PC",
                publisher: "USGAMER",
                date: "17 Aug 2026",
                image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
                tags: ["#TheWitcher4", "#CDProjektRed", "#RPG"],
            },
            {
                id: 105,
                title: "Gamescom 2026 Cologne Opening Night Live Lineup Teases Unannounced World Premieres",
                category: "PlayStation",
                publisher: "IGN",
                date: "16 Aug 2026",
                image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
                tags: ["#Gamescom2026", "#GamingNews", "#ONL"],
            },
            {
                id: 106,
                title: "Elden Ring: Tarnished Edition Set for Nintendo Switch 2 Launch With Shadow of the Erdtree",
                category: "Nintendo Switch",
                publisher: "KOTAKU",
                date: "15 Aug 2026",
                image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
                tags: ["#EldenRing", "#Switch2", "#FromSoftware"],
            },
            {
                id: 107,
                title: "Marvel Tōkon: Fighting Souls 4v4 Tag Team Fighter Hits Consoles and PC",
                category: "PlayStation",
                publisher: "DESTRUCTOID",
                date: "14 Aug 2026",
                image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
                tags: ["#MarvelFightingGames", "#FightingGames", "#PS5"],
            },
            {
                id: 108,
                title: "Xbox Game Pass Wave 2 Adds Major Day-One Titles & Cloud Ray Tracing Upgrades",
                category: "Xbox",
                publisher: "USGAMER",
                date: "13 Aug 2026",
                image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80",
                tags: ["#XboxGamePass", "#Xbox", "#CloudGaming"],
            },
            {
                id: 109,
                title: "Star Wars: Zero Company Tactical Strategy Game Arrives Late August",
                category: "PC",
                publisher: "IGN",
                date: "12 Aug 2026",
                image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
                tags: ["#StarWars", "#TacticalGames", "#PCGaming"],
            },
            {
                id: 110,
                title: "Mortal Shell II Soulslike Sequel Launches With Expanded Combat System & Massive Bosses",
                category: "PlayStation",
                publisher: "KOTAKU",
                date: "11 Aug 2026",
                image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=600&q=80",
                tags: ["#MortalShell2", "#Soulslike", "#PS5"],
            },
            {
                id: 111,
                title: "Lies of P: Complete Edition Bundles Base Game & Overture DLC for Switch 2",
                category: "Nintendo Switch",
                publisher: "DESTRUCTOID",
                date: "10 Aug 2026",
                image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80",
                tags: ["#LiesOfP", "#Switch2", "#ActionRPG"],
            },
            {
                id: 112,
                title: "Big Walk Open-World Social Adventure Debuts With Metacritic Score of 91",
                category: "PC",
                publisher: "USGAMER",
                date: "09 Aug 2026",
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
                tags: ["#BigWalk", "#IndieGame", "#CoOp"],
            },
            {
                id: 113,
                title: "Cyberpunk 2077 Sequel Code Named 'Orion' Enters Full Production Phase in Boston Studio",
                category: "PC",
                publisher: "IGN",
                date: "08 Aug 2026",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
                tags: ["#CyberpunkOrion", "#CDPR", "#UnrealEngine5"],
            },
            {
                id: 114,
                title: "Overwatch 2 Season Update Reworks Tank Role & Adds New Peruvian Hero Support",
                category: "Xbox",
                publisher: "KOTAKU",
                date: "07 Aug 2026",
                image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
                tags: ["#Overwatch2", "#Blizzard", "#HeroShooter"],
            },
            {
                id: 115,
                title: "Hollow Knight: Silksong Features in Latest Indie Direct Stream Showcase",
                category: "Nintendo Switch",
                publisher: "DESTRUCTOID",
                date: "06 Aug 2026",
                image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
                tags: ["#Silksong", "#TeamCherry", "#Metroidvania"],
            },
            {
                id: 116,
                title: "Final Fantasy XVI PC Edition Receives Ultrawide Support & NVIDIA DLSS 3.5 Patch",
                category: "PC",
                publisher: "USGAMER",
                date: "05 Aug 2026",
                image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
                tags: ["#FF16", "#SquareEnix", "#PCGaming"],
            },
            {
                id: 117,
                title: "Ghost of Yōtei Teased by Sucker Punch as Next Chapter Following Tsushima",
                category: "PlayStation",
                publisher: "IGN",
                date: "04 Aug 2026",
                image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
                tags: ["#GhostOfYotei", "#SuckerPunch", "#PS5"],
            },
            {
                id: 118,
                title: "Halo Studios Confirms Future Franchise Entries Built Exclusively on Unreal Engine 5",
                category: "Xbox",
                publisher: "KOTAKU",
                date: "03 Aug 2026",
                image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80",
                tags: ["#Halo", "#Xbox", "#UE5"],
            },
            {
                id: 119,
                title: "Metroid Prime 4: Beyond Details Galactic Federation Lore & New Scan Visor Tech",
                category: "Nintendo Switch",
                publisher: "DESTRUCTOID",
                date: "02 Aug 2026",
                image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
                tags: ["#MetroidPrime4", "#Nintendo", "#Switch"],
            },
            {
                id: 120,
                title: "Path of Exile 2 Early Access Milestone Reaches 2 Million Active Beta Testers",
                category: "PC",
                publisher: "USGAMER",
                date: "01 Aug 2026",
                image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=600&q=80",
                tags: ["#PathOfExile2", "#GGG", "#ARPG"],
            },
        ];

        return [...dbList, ...mockList];
    }, [dbArticles]);

    // Calculate 3 Related Blogs (Randomized on refresh, ranked by title/hashtag/category relevance)
    const relatedArticles = useMemo(() => {
        const pool = allArticlesPool.filter((a) => String(a.id) !== String(article.id));
        if (pool.length === 0) return [];

        const currentTitleWords = article.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const currentTags = (article.tags || []).map((t) => t.toLowerCase());

        // Score candidates by relevance
        const scored = pool.map((item) => {
            let score = 0;
            const itemTitleLower = item.title.toLowerCase();

            // Category match (+3 points)
            if (item.category === article.category) score += 3;

            // Title keyword match (+2 points per match)
            currentTitleWords.forEach((word) => {
                if (itemTitleLower.includes(word)) score += 2;
            });

            // Hashtag match (+3 points per match)
            const itemTags = (item.tags || []).map((t) => t.toLowerCase());
            currentTags.forEach((tag) => {
                if (itemTags.includes(tag)) score += 3;
            });

            // Add random shuffle weight on each refresh (+0..5 random points)
            score += Math.random() * 5;

            return { item, score };
        });

        // Sort candidates by score descending and pick top 3
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 3).map((s) => s.item);
    }, [article, allArticlesPool]);

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
                    <Link href={route('blog')} className="hover:text-white transition">News</Link>
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
                            {dbArticle ? (
                                <div
                                    className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#9CA3AF] prose-a:text-[#22C55E] prose-strong:text-white"
                                    dangerouslySetInnerHTML={{ __html: dbArticle.content }}
                                />
                            ) : (
                                (article.content || []).map((sec, idx) => {
                                    if (sec.type === 'heading') {
                                        return (
                                            <h2 key={idx} className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white pt-4 tracking-tight">
                                                {sec.text}
                                            </h2>
                                        );
                                    }
                                    if (sec.type === 'subheading') {
                                        return (
                                            <h3 key={idx} className="text-lg sm:text-xl font-bold text-white pt-2">
                                                {sec.text}
                                            </h3>
                                        );
                                    }
                                    if (sec.type === 'list') {
                                        return (
                                            <ul key={idx} className="space-y-2 pl-4 list-disc marker:text-[#22C55E]">
                                                {sec.items.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return <p key={idx}>{sec.text}</p>;
                                })
                            )}
                        </article>

                        {/* Article Sources / References (Per-line vertical list with clean hostname extraction) */}
                        {((dbArticle?.sources && dbArticle.sources.length > 0) || (dbArticle?.source_url)) ? (
                            <div className="pt-6 border-t border-[#1F2923] space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B948F] flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <span>Sources & References</span>
                                </h4>
                                <ol className="space-y-2 list-decimal list-inside text-xs font-semibold text-[#8B948F]">
                                    {dbArticle.sources && dbArticle.sources.length > 0 ? (
                                        dbArticle.sources.filter(s => s.url || s.name).map((src, idx) => {
                                            let domainName = src.name;
                                            if (!domainName && src.url) {
                                                try {
                                                    domainName = new URL(src.url).hostname.replace(/^www\./, '');
                                                } catch {
                                                    domainName = src.url;
                                                }
                                            }
                                            return (
                                                <li key={idx} className="marker:text-[#22C55E] marker:font-bold">
                                                    <a
                                                        href={src.url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 rounded-xl bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-xs font-semibold text-[#22C55E] hover:underline inline-flex items-center gap-2 transition shadow-sm"
                                                    >
                                                        <span>{domainName || `Source #${idx + 1}`}</span>
                                                        <svg className="w-3 h-3 text-[#8B948F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </li>
                                            );
                                        })
                                    ) : dbArticle.source_url ? (
                                        (() => {
                                            let domainName = dbArticle.source_name;
                                            if (!domainName && dbArticle.source_url) {
                                                try {
                                                    domainName = new URL(dbArticle.source_url).hostname.replace(/^www\./, '');
                                                } catch {
                                                    domainName = dbArticle.source_url;
                                                }
                                            }
                                            return (
                                                <li className="marker:text-[#22C55E] marker:font-bold">
                                                    <a
                                                        href={dbArticle.source_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 rounded-xl bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-xs font-semibold text-[#22C55E] hover:underline inline-flex items-center gap-2 transition shadow-sm"
                                                    >
                                                        <span>{domainName || 'Original Source'}</span>
                                                        <svg className="w-3 h-3 text-[#8B948F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </li>
                                            );
                                        })()
                                    ) : null}
                                </ol>
                            </div>
                        ) : null}
                    </div>

                    {/* RIGHT COLUMN: Sidebar Widgets */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* 1. Share Widget (Updated X & Instagram icons) */}
                        <div className="bg-[#131916] border border-[#1F2923] rounded-2xl p-5 sm:p-6 space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                Share Article
                            </h3>
                            <div className="flex items-center gap-3">
                                {[
                                    { name: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                                    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                                    { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                                    { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 100 4 2 2 0 000-4z' },
                                ].map((soc) => (
                                    <button
                                        key={soc.name}
                                        className="w-10 h-10 rounded-xl bg-[#161F1A] border border-[#1F2923] text-[#8B948F] hover:text-[#22C55E] hover:border-[#22C55E]/40 flex items-center justify-center transition-all"
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
                                {(article.tags || []).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 rounded-xl bg-[#161F1A] border border-[#1F2923] text-xs text-[#8B948F] hover:text-white hover:border-[#22C55E]/40 cursor-pointer transition-all"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 3. Related Blogs Widget (Randomized 3 items matching relevance) */}
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

                        {/* 4. Support Us Widget */}
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

            <PublicFooter />
        </div>
    );
}
