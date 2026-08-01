<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GameAlsoReviewed extends Notification
{
    use Queueable;

    public function __construct(
        public Review $review,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'game_also_reviewed',
            'reviewer_id' => $this->review->user_id,
            'reviewer_name' => $this->review->user->name,
            'reviewer_avatar' => $this->review->user->avatar,
            'game_id' => $this->review->game_id,
            'game_slug' => $this->review->game->slug,
            'game_title' => $this->review->game->title,
        ];
    }
}