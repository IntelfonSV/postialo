<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledPost extends Model
{
    protected $fillable = [
        'schedule_id',
        'network',
        'content',
        'status',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
