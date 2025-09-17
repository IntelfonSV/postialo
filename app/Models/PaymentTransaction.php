<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $table = 'payment_transactions';

    protected $fillable = [
        'payment_id',
        'user_id',
        'provider',
        'ern',
        'provider_token',
        'provider_reference',
        'status',
        'amount',
        'currency',
        'transacted_at',
        'snapshot',
        'first_seen_at',
        'last_seen_at',
    ];

    protected $casts = [
        'amount'         => 'decimal:2',
        'snapshot'       => 'array',
        'transacted_at'  => 'datetime',
        'first_seen_at'  => 'datetime',
        'last_seen_at'   => 'datetime',
    ];

    // Relaciones
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes útiles
    public function scopeByErn($q, string $ern) { return $q->where('ern', $ern); }
    public function scopeByToken($q, string $token) { return $q->where('provider_token', $token); }
    public function scopeWithStatus($q, string $status) { return $q->where('status', $status); }
}
