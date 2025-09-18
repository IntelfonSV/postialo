<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'name',
        'sku',
        'price',
        'currency',
        'intervalo_meses',
        'country_code',
        'description',
        'metadata',
        'active',
    ];

    protected $casts = [
        'price'           => 'decimal:2',
        'intervalo_meses' => 'integer',
        'metadata'        => 'array',
        'active'          => 'boolean',
    ];

    // Relación: un producto puede aparecer en muchos ítems de pago (snapshot)
    public function paymentItems()
    {
        return $this->hasMany(PaymentItem::class);
    }

    // Scopes útiles
    public function scopeActive($q)   { return $q->where('active', true); }
    public function scopeBySku($q,$s) { return $q->where('sku', $s); }
}
