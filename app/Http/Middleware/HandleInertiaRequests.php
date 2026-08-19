<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $rawgAuthImages = Cache::remember('rawg_auth_bg_images_pool', 1800, function () {
            try {
                $rawg = new \App\Services\RawgService();
                $pop1 = $rawg->popular(1);
                $pop2 = $rawg->popular(2);
                $merged = array_merge($pop1['results'] ?? [], $pop2['results'] ?? []);

                return collect($merged)
                    ->pluck('background_image')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
            } catch (\Throwable $e) {
                return [];
            }
        });

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'rawgAuthImages' => $rawgAuthImages,
        ];
    }
}
