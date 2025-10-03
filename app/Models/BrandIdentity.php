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
        'website',
        'whatsapp_number',
        'facebook_page_id',
        'instagram_account_id',
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

    public function logos()
    {
        return $this->hasMany(Logo::class);
    }

    public function isCompleted()
    {
        return $this->company_identity && $this->mission_vision && $this->products_services && $this->company_history && $this->guidelines_json && $this->website && $this->whatsapp_number && $this->facebook_page_id && $this->instagram_account_id;
    }
}
