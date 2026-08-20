<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class RankCongratulated extends Notification
{
    use Queueable;

    public function __construct(
        public User $sender,
        public string $rankName,
        public string $message
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'rank_congratulation',
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'sender_avatar' => $this->sender->avatar,
            'rank_name' => $this->rankName,
            'message' => $this->message,
        ];
    }
}
