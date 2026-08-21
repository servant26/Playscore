<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'cover',
        'content',
        'category',
        'publisher',
        'publisher_logo',
        'publisher_bg',
        'author',
        'read_time',
        'source_name',
        'source_url',
        'sources',
        'tags',
        'status',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'sources' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
