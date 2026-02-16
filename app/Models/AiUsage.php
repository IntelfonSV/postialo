<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiUsage extends Model
{
        use HasFactory;

    protected $fillable = [
        'user_id',
        'model',
        'prompt_tokens',
        'candidates_tokens',
        'total_tokens',
        'operation',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
