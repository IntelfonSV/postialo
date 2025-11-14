<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partner extends Model
{
     use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'contact_email',
        'logo_path',
        'restrictions',
        'branding',
        'active',
    ];

    protected $casts = [
        'restrictions' => 'array',
        'branding'     => 'array',
        'active'       => 'boolean',
    ];

    // Relación con usuarios
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Helpers
    public function hasRestriction(string $field): bool
    {
        $restrictions = $this->restrictions['fixed_fields'] ?? [];
        return in_array($field, $restrictions);
    }

    public function getBrandingValue(string $key, $default = null)
    {
        return $this->branding[$key] ?? $default;
    }
}
