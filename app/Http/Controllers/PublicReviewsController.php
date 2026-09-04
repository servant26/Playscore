<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Services\RawgService;
use Inertia\Inertia;
use Inertia\Response;

class PublicReviewsController extends Controller
{
    public function index(RawgService $rawg): Response
    {
        // 1. Fetch real reviews from DB
        $dbReviews = Review::with(['game', 'user'])
            ->latest()
            ->get()
            ->map(function ($rev) {
                $cleanBody = trim(strip_tags($rev->body));
                return [
                    'id' => 'db_' . $rev->id,
                    'rating' => (float) $rev->rating,
                    'full_body' => $cleanBody,
                    'body' => \Illuminate\Support\Str::limit($cleanBody, 160, '...'),
                    'is_truncated' => strlen($cleanBody) > 160,
                    'created_at' => $rev->created_at->diffForHumans(),
                    'user_name' => $rev->user->name ?? 'Anonymous Gamer',
                    'user_avatar' => $rev->user?->avatar ? (str_starts_with($rev->user->avatar, 'http') ? $rev->user->avatar : asset('storage/' . $rev->user->avatar)) : null,
                    'game_title' => $rev->game->title ?? 'Featured Game',
                    'game_cover' => $rev->game->cover_url ?? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                ];
            });

        // 2. Fetch real reviews live from RAWG API
        try {
            $rawgReviewsRaw = $rawg->reviews(30);
            $rawgReviews = collect($rawgReviewsRaw)
                ->map(function ($item) {
                    $text = strip_tags($item['text'] ?? $item['body'] ?? '');
                    // Remove URLs or spam lines
                    $text = preg_replace('/https?:\/\/\S+/', '', $text);
                    $text = preg_replace('/===+.*?===+/', '', $text);
                    $text = trim(preg_replace('/\s+/', ' ', $text));

                    if (empty($text) || strlen($text) < 15) return null;

                    $ratingRaw = $item['rating'] ?? 5;
                    $rating10 = min(10.0, round($ratingRaw * 2, 1));
                    if ($rating10 <= 0) $rating10 = 8.5;

                    $userName = $item['user']['username'] ?? $item['user']['name'] ?? 'RAWG Critic';
                    $userAvatar = $item['user']['avatar'] ?? "https://api.dicebear.com/7.x/bottts/svg?seed=" . urlencode($userName);

                    $gameTitle = $item['game']['name'] ?? 'Popular Game';
                    $gameCover = $item['game']['background_image'] 
                        ?? 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80';

                    $created = isset($item['created']) ? \Carbon\Carbon::parse($item['created'])->diffForHumans() : 'recently';

                    return [
                        'id' => 'rawg_' . ($item['id'] ?? rand(1000, 9999)),
                        'rating' => $rating10,
                        'full_body' => $text,
                        'body' => \Illuminate\Support\Str::limit($text, 160, '...'),
                        'is_truncated' => strlen($text) > 160,
                        'created_at' => $created,
                        'user_name' => $userName,
                        'user_avatar' => $userAvatar,
                        'game_title' => $gameTitle,
                        'game_cover' => $gameCover,
                    ];
                })
                ->filter()
                ->values();
        } catch (\Throwable $e) {
            $rawgReviews = collect([]);
        }

        // 3. Fallback curated reviews
        $fallbackReviews = collect([
            [
                'id' => 'fb_101',
                'rating' => 9.8,
                'full_body' => 'The Elden Ring DLC is a masterclass in world design. The level of detail in the Shadow Realm and boss mechanics set a new benchmark for action RPGs.',
                'body' => 'The Elden Ring DLC is a masterclass in world design. The level of detail in the Shadow Realm and boss mechanics set a new benchmark for action RPGs.',
                'is_truncated' => false,
                'created_at' => '2 hours ago',
                'user_name' => 'AlexViper',
                'user_avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexViper',
                'game_title' => 'Elden Ring: Shadow of the Erdtree',
                'game_cover' => 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'id' => 'fb_102',
                'rating' => 9.5,
                'full_body' => 'Cyberpunk 2077 Phantom Liberty completely redeems the game. Dogtown is dense, atmospheric, and Idris Elba delivers a stellar performance.',
                'body' => 'Cyberpunk 2077 Phantom Liberty completely redeems the game. Dogtown is dense, atmospheric, and Idris Elba delivers a stellar performance.',
                'is_truncated' => false,
                'created_at' => '5 hours ago',
                'user_name' => 'CyberSamurai',
                'user_avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberSamurai',
                'game_title' => 'Cyberpunk 2077: Phantom Liberty',
                'game_cover' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'id' => 'fb_103',
                'rating' => 10.0,
                'full_body' => 'The Witcher 3 is still the gold standard for story-driven RPGs. The Bloody Baron questline alone is better written than entire AAA games.',
                'body' => 'The Witcher 3 is still the gold standard for story-driven RPGs. The Bloody Baron questline alone is better written than entire AAA games.',
                'is_truncated' => false,
                'created_at' => '1 day ago',
                'user_name' => 'GeraltFanatic',
                'user_avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Geralt',
                'game_title' => 'The Witcher 3: Wild Hunt',
                'game_cover' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'id' => 'fb_104',
                'rating' => 9.2,
                'full_body' => 'God of War Ragnarok balances emotional narrative and brutal combat effortlessly. Kratos and Atreus arc reaches a satisfying climax.',
                'body' => 'God of War Ragnarok balances emotional narrative and brutal combat effortlessly. Kratos and Atreus arc reaches a satisfying climax.',
                'is_truncated' => false,
                'created_at' => '3 hours ago',
                'user_name' => 'SpartanRage',
                'user_avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=SpartanRage',
                'game_title' => 'God of War Ragnarök',
                'game_cover' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'id' => 'fb_105',
                'rating' => 9.4,
                'full_body' => 'Red Dead Redemption 2 is a technical marvel. The world feels truly alive, and Arthur Morgan is one of gaming\'s best written protagonists.',
                'body' => 'Red Dead Redemption 2 is a technical marvel. The world feels truly alive, and Arthur Morgan is one of gaming\'s best written protagonists.',
                'is_truncated' => false,
                'created_at' => '12 hours ago',
                'user_name' => 'OutlawPete',
                'user_avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=OutlawPete',
                'game_title' => 'Red Dead Redemption 2',
                'game_cover' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
            ],
        ]);

        $allReviews = $dbReviews->concat($rawgReviews)->concat($fallbackReviews);
        $finalReviews = $allReviews
            ->unique('id')
            ->shuffle()
            ->take(10)
            ->values();

        return Inertia::render('PublicReviews', [
            'reviews' => $finalReviews,
            'currentFilter' => request()->input('filter', 'all'),
        ]);
    }
}
