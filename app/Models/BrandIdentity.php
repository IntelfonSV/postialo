<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BrandIdentity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_identity',
        'mission_vision',
        'products_services',
        'company_history',
        'guidelines_json',
    ];

    protected $casts = [
        'guidelines_json' => 'array',
    ];

    /**
     * Relación con el modelo User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
