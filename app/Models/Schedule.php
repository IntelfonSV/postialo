<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'month',
        'year',
        'idea',
        'objective',
        'prompt_image',
        'networks',
        'template_id',
        'status',
        'task_id',
        'image',
        'scheduled_date',
    ];

    protected $casts = [
        'networks' => 'array',
        'scheduled_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function posts()
    {
        return $this->hasMany(SchedulePost::class);
    }
}
