<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentItem extends Model
{
    use HasFactory;

    protected $table = 'payment_items';

    protected $fillable = [
        'payment_id',
        'product_id',
        'description',
        'price',
        'quantity',
        'line_total',
    ];

    protected $casts = [
        'price'      => 'decimal:2',
        'quantity'   => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
