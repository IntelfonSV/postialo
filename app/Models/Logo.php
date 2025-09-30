<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logo extends Model
{
    protected $fillable = ['brand_identity_id', 'image', 'is_active'];

    public function brandIdentity() {
        return $this->belongsTo(BrandIdentity::class);
    }
}
