<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class ShortLink extends Model
{
    protected $fillable = ['code', 'original_url', 'user_id'];

    public static function generateCode($length = 6)
    {
        do {
            $code = Str::random($length);
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
