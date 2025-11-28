<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleImage extends Model
{
    protected $fillable = [
        'schedule_id',
        'image_source',
        'image_path',
        'generated_image_path',
        'is_approved',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

}
