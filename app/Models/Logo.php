<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logo extends Model
{
    protected $fillable = ['user_id', 'url', 'is_active'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
