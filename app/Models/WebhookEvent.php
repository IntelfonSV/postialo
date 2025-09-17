<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookEvent extends Model
{
    use HasFactory;

    protected $table = 'webhook_events';

    protected $fillable = [
        'provider',
        'event_id',
        'ern',
        'status',
        'raw_body',
        'headers',
        'signature',
        'parsed',
        'processed_at',
    ];

    protected $casts = [
        'headers'      => 'array',
        'parsed'       => 'array',
        'processed_at' => 'datetime',
    ];

    // Relación lógica por ERN (sin FK): evento → cargo planificado
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'ern', 'ern');
    }

    // Scopes útiles
    public function scopeUnprocessed($q) { return $q->whereNull('processed_at'); }
    public function scopeByProvider($q, string $p) { return $q->where('provider', $p); }
    public function scopeByErn($q, string $e) { return $q->where('ern', $e); }
}
