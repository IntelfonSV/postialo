<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'payment_session_id',
        'user_id',
        'ern',
        'description',
        'charge_date',
        'amount',
        'currency',
        'country_code',
        'status',
        'master_token',
        'pending_token',
        'reference',
    ];

    protected $casts = [
        'amount'     => 'decimal:2',
        'charge_date'=> 'date',
    ];

    // Relaciones
    public function session()
    {
        return $this->belongsTo(PaymentSession::class, 'payment_session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(PaymentItem::class);
    }

    public function transactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    // Scopes útiles
    public function scopeByErn($q, string $ern) { return $q->where('ern', $ern); }
    public function scopeForUser($q, int $userId) { return $q->where('user_id', $userId); }
    public function scopeWithStatus($q, string $status) { return $q->where('status', $status); }
}
