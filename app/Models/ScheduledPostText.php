<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledPostText extends Model
{
    protected $fillable = [
        'scheduled_post_id',
        'content',
    ];

    public function scheduledPost()
    {
        return $this->belongsTo(ScheduledPost::class);
    }
}
