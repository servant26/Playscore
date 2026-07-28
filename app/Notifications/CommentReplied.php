<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CommentReplied extends Notification
{
    use Queueable;

    public function __construct(
        public Comment $reply,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'comment_reply',
            'replier_name' => $this->reply->user->name,
            'replier_avatar' => $this->reply->user->avatar,
            'comment_body' => $this->reply->body,
            'game_id' => $this->reply->game_id,
            'game_slug' => $this->reply->game->slug,
            'game_title' => $this->reply->game->title,
            'comment_id' => $this->reply->parent_id,
        ];
    }
}