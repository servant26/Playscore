<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'title',
        'slug',
        'cover_url',
        'trailer_url',
        'description',
        'release_date',
        'developer',
        'publisher',
        'rawg_rating',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'rawg_rating' => 'decimal:2',
        ];
    }

    /**
     * Sanitasi URL agar hanya mengizinkan protokol https:// yang valid
     */
    private static function sanitizeUrl(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        $url = trim($url);

        // Hanya izinkan URL yang dimulai dengan https://
        if (!str_starts_with(strtolower($url), 'https://')) {
            return null;
        }

        // Validasi struktur URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        return $url;
    }

    public function setCoverUrlAttribute(?string $value): void
    {
        $this->attributes['cover_url'] = self::sanitizeUrl($value);
    }

    public function setTrailerUrlAttribute(?string $value): void
    {
        $this->attributes['trailer_url'] = self::sanitizeUrl($value);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function interests(): BelongsToMany
    {
        return $this->belongsToMany(Interest::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function listedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_game_lists');
    }
}