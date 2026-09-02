<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Story extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'rank_name',
        'rank_count',
        'review_id',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Format story model menjadi struktur array yang konsisten untuk frontend.
     */
    public function formatForFrontend(): ?array
    {
        if ($this->type === 'rank_up') {
            return [
                'id' => $this->id,
                'type' => 'rank_up',
                'user_id' => $this->user_id,
                'user_name' => $this->user?->name ?? 'User',
                'user_avatar' => $this->user?->avatar,
                'created_at' => $this->created_at?->diffForHumans(),
                'rank_name' => $this->rank_name,
                'rank_count' => $this->rank_count,
            ];
        }

        if (!$this->review || !$this->review->game) {
            return null;
        }

        return [
            'id' => $this->id,
            'type' => 'review',
            'user_id' => $this->user_id,
            'user_name' => $this->user?->name ?? 'User',
            'user_avatar' => $this->user?->avatar,
            'created_at' => $this->created_at?->diffForHumans(),
            'review' => [
                'rating' => (float) $this->review->rating,
                'body' => $this->review->body,
                'game_title' => $this->review->game->title,
                'game_cover' => $this->review->game->cover_url,
                'game_slug' => $this->review->game->slug,
            ],
        ];
    }
}
