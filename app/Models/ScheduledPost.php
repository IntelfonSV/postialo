<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledPost extends Model
{
    protected $fillable = [
        'schedule_id',
        'network',
        'selected_text_id',
        'status',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function texts()
    {
        return $this->hasMany(ScheduledPostText::class);
    }

    public function selectedText()
    {
        return $this->belongsTo(ScheduledPostText::class, 'selected_text_id');
    }
}
