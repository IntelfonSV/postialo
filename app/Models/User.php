<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function brandIdentity()
    {
        return $this->hasOne(BrandIdentity::class);
    }
    
    public function templates()
    {
        return $this->hasMany(Template::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function hasActiveSubscription()
    {
        $subscription = $this->subscription;
        return $subscription && $subscription->isActive();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function hasActivePayment()
    {
        return $this->payments()->where('status', 'COMPLETED')->where('valid_until', '>=', now())->exists();
    }


    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function demos()
    {
        return $this->hasMany(Demo::class);
    }

    public function hasActiveDemo()
    {
        return $this->demos()->where('valid_until', '>=', now())->exists();
    }
    
}
