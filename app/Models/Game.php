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

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function listedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_game_lists');
    }
}