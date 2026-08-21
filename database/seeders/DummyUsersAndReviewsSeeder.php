<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DummyUsersAndReviewsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Fetch all imported games that have valid cover_urls directly from database
        $gameModels = Game::whereNotNull('cover_url')
            ->where('cover_url', '!=', '')
            ->where('cover_url', 'like', 'http%')
            ->get();

        // If no games exist yet, fallback to popular hardcoded set
        if ($gameModels->isEmpty()) {
            $popularGames = [
                ['external_id' => 3498, 'title' => 'Grand Theft Auto V', 'slug' => 'grand-theft-auto-v', 'cover_url' => 'https://media.rawg.io/media/games/20a/20a47fe03147779997a144e2137b0162.jpg', 'rawg_rating' => 4.47],
                ['external_id' => 3328, 'title' => 'The Witcher 3: Wild Hunt', 'slug' => 'the-witcher-3-wild-hunt', 'cover_url' => 'https://media.rawg.io/media/games/618/618c47b6e369d39b4f0825d19d61a659.jpg', 'rawg_rating' => 4.65],
                ['external_id' => 4200, 'title' => 'Portal 2', 'slug' => 'portal-2', 'cover_url' => 'https://media.rawg.io/media/games/2ba/2bac0e87cf44e5b597b227d301c90526.jpg', 'rawg_rating' => 4.61],
                ['external_id' => 28, 'title' => 'Red Dead Redemption 2', 'slug' => 'red-dead-redemption-2', 'cover_url' => 'https://media.rawg.io/media/games/511/51182119f85199991f3b4eeee3e22d9b.jpg', 'rawg_rating' => 4.58],
                ['external_id' => 41494, 'title' => 'Cyberpunk 2077', 'slug' => 'cyberpunk-2077', 'cover_url' => 'https://media.rawg.io/media/games/26d/26d4437715bee60138daf4a7777b5713.jpg', 'rawg_rating' => 4.15],
            ];
            foreach ($popularGames as $g) {
                Game::firstOrCreate(
                    ['external_id' => $g['external_id']],
                    ['title' => $g['title'], 'slug' => $g['slug'], 'cover_url' => $g['cover_url'], 'rawg_rating' => $g['rawg_rating']]
                );
            }
            $gameModels = Game::whereNotNull('cover_url')
                ->where('cover_url', '!=', '')
                ->where('cover_url', 'like', 'http%')
                ->get();
        }

        $gameListArray = $gameModels->all();

        // 2. Sample Review Comments Templates (Indonesian Gaming Community style)
        $positiveReviews = [
            "Game paling masterpiece yang pernah gue mainin! Grafis, gameplay, dan ceritanya bener-bener dapet banget. Worth it 100%.",
            "Seru banget parah! Udah namatin lebih dari 2x dan tetep nggak bosen. Mekaniknya smooth abis.",
            "Visualnya manjain mata banget, soundtrack-nya juga keren abis! Sangat direkomendasikan buat pecinta genre ini.",
            "Awalnya coba-coba karena temen rekomendasiin, ternyata nagih banget! Ceritanya emosional banget di ending.",
            "Solusi tepat buat ngisi waktu luang. Combat system-nya sangat memuaskan!",
            "Pengalaman gaming terbaik tahun ini. Lore dan dunianya luas banget buat dieksplorasi.",
            "Storytelling-nya kelas atas. Karakter-karakternya punya perkembangan yang kuat.",
            "Gak nyesel beli pas diskon, bahkan kalau harga normal pun tetep sangat layak dibeli!",
            "Fitur multiplayer & co-op nya seru banget dimainin bareng temen-temen tongkrongan.",
            "Kualitas audio dan voice acting-nya top notch! Detail di gamenya bener-bener niat.",
        ];

        $mixedReviews = [
            "Gamenya lumayan seru, cuma ada beberapa bug kecil yang kadang mengganggu pas gameplay. Tapi overall tetep oke kok.",
            "Grafis bagus banget, sayangnya optimasi di PC agak berat kalau spec pas-pasan. Tapi jalannya cerita keren.",
            "Ceritanya agak lambat di awal, tapi pas udah pertengahan ke belakang baru kerasa serunya.",
            "Keren sih, tapi butuh grinding yang lumayan banyak buat dapetin item bagus. Cocok buat yang punya banyak waktu santai.",
            "Game yang bagus, tapi harga DLC-nya agak terlalu mahal menurut gue.",
            "Mekaniknya agak rumit buat pemula, tapi setelah terbiasa ternyata seru juga.",
        ];

        // 3. Male and Female Gen Z Gamer Users
        $maleUsers = [
            'Kevin Vernando', 'Arvin Gamerz', 'Daffa Kenzie', 'Raihan Naufal', 'Alvaro Satria',
            'Farel Pixel', 'Arya Clutch', 'Zidane Vortex', 'Aldo Rush', 'Reihan Phantom',
            'Gibran Pulse', 'Ezio Gaming', 'Devon Slayer', 'Bagas Cyber', 'Taufik Shadow',
            'Farhan Horizon', 'Dimas Quantum', 'Bryan Eclipse', 'Satria Blaze', 'Hafiz Hyper',
            'Wildan Vex', 'Rifky Spectre', 'Faisal Nomad', 'Dicky Striker', 'Raditya Nova',
            'Naufal Apex', 'Reza Varian', 'Fadlan Titan', 'Galang Havoc', 'Fathan Sentinel',
            'Zikri Paragon', 'Adrian Apex', 'Bima Vanguard', 'Fariz Obsidian', 'Danang Phantom',
            'Yusuf Catalyst', 'Rizky Glitch', 'Hasan Inferno', 'Akbar Sentinel', 'Irfan Spectre',
            'Hanif Vektor', 'Bayu Cipher', 'Fikri Dynamo', 'Ivan Overload', 'Aditya Havoc',
            'Raka Void', 'Dennis Drift', 'Eko Razor', 'Gilang Vector', 'Gusti Vortex',
            'Hardi Phantom', 'Jaka Blaze', 'Lukman Apex', 'Fadel Paragon', 'Rian Cyber'
        ];

        $femaleUsers = [
            'Nabila Syakira', 'Kaila Zafira', 'Siti Kayis', 'Niken Salsabila', 'Vanesa Cyra',
            'Syahla Violet', 'Keysha Aurelia', 'Nadya Zahrani', 'Zahra Nebula', 'Clarissa Skye',
            'Amanda Frost', 'Kayla Astra', 'Alya Vesper', 'Tiara Pixel', 'Aurelia Solis',
            'Salma Zenith', 'Nadhira Echo', 'Rania Lumina', 'Aisha Ember', 'Keysha Nyx',
            'Tania Zephyr', 'Syifa Valkyrie', 'Naylah Mirage', 'Indah Solstice', 'Laras Aurora',
            'Chika Celestial', 'Zahra Eclipse', 'Aisyah Radiant', 'Mira Horizon', 'Gendis Pulse',
            'Intan Tempest', 'Keisha Zenith', 'Talita Nova', 'Putri Starlight', 'Naisya Comet',
            'Lila Quasar', 'Callista Zenith', 'Sheila Nebula', 'Cynthia Pulse', 'Vania Solis',
            'Feby Echo', 'Sherly Nyx', 'Tasya Horizon', 'Bella Catalyst', 'Kania Ember',
            'Ria Radiance', 'Dina Sparkle', 'Sora Pixel', 'Grace Lunar', 'Dhea Celestial'
        ];

        $maleAvatars = [
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
        ];

        $femaleAvatars = [
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80',
        ];

        $defaultPassword = Hash::make('password123');
        $usersCount = 0;
        $reviewsCount = 0;

        // Build list of (name, gender)
        $allUsersList = [];
        foreach ($maleUsers as $mName) {
            $allUsersList[] = ['name' => $mName, 'gender' => 'male'];
        }
        foreach ($femaleUsers as $fName) {
            $allUsersList[] = ['name' => $fName, 'gender' => 'female'];
        }

        foreach ($allUsersList as $index => $uInfo) {
            $name = $uInfo['name'];
            $gender = $uInfo['gender'];
            $username = Str::slug($name, '') . ($index + 1);
            $email = $username . '@playscore.id';

            // Assign gender-accurate photo avatar
            if ($gender === 'male') {
                $avatar = $maleAvatars[$index % count($maleAvatars)];
            } else {
                $avatar = $femaleAvatars[$index % count($femaleAvatars)];
            }

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => $defaultPassword,
                    'role' => 'user',
                    'avatar' => $avatar,
                    'created_at' => now()->subDays(rand(1, 180)),
                ]
            );
            $usersCount++;

            // Attach 3 to 6 random interests to each user for realistic taste matching
            $allInterests = \App\Models\Interest::all();
            if ($allInterests->isNotEmpty()) {
                $randomInterests = $allInterests->random(min(rand(3, 6), $allInterests->count()));
                $user->interests()->syncWithoutDetaching($randomInterests->pluck('id'));
            }

            // Each user leaves 2 to 5 random reviews across popular imported games
            $reviewedKeys = (array) array_rand($gameListArray, rand(2, min(5, count($gameListArray))));

            foreach ($reviewedKeys as $gameIndex) {
                $game = $gameListArray[$gameIndex];
                
                // 80% chance of high rating (4-5), 20% chance of 3 rating
                $rating = (rand(1, 100) <= 80) ? rand(4, 5) : 3;
                $commentArray = ($rating >= 4) ? $positiveReviews : $mixedReviews;
                $body = $commentArray[array_rand($commentArray)];

                Review::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'game_id' => $game->id,
                    ],
                    [
                        'rating' => $rating,
                        'body' => $body,
                        'created_at' => now()->subDays(rand(0, 90)),
                    ]
                );
                $reviewsCount++;
            }
        }

        $this->command->info("Success! Created/Ensured {$usersCount} dummy gamer users and {$reviewsCount} game reviews.");
    }
}
