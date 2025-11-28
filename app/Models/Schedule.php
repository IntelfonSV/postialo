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
        'image_source',
        'networks',
        'template_id',
        'status',
        'selected_image_id',
        'scheduled_date',
    ];

    protected $casts = [
        'networks' => 'array',
        'scheduled_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    // Todas las imágenes generadas
    public function images()
    {
        return $this->hasMany(ScheduleImage::class);
    }
    
    // Imagen final seleccionada
    public function selectedImage()
    {
        return $this->belongsTo(ScheduleImage::class, 'selected_image_id');
    }
    

    public function posts()
    {
        return $this->hasMany(ScheduledPost::class);
    }
}
