<?php

namespace App\Models;

use App\Scopes\ApprovedScope;
use App\Traits\SanitizedRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Subscription extends Model  implements HasMedia
{
    use InteractsWithMedia, SanitizedRequest;

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new ApprovedScope);
    }

    protected static function booted()
    {
        static::created(function ($subscription) {
            switch($subscription->service->plan_period_format) {
                case 'D':
                    $end_at = Carbon::now()->addDays($subscription->service->plan_period);
                    break;
                case 'W':
                    $end_at = Carbon::now()->addWeeks($subscription->service->plan_period);
                    break;
                case 'M':
                    $end_at = Carbon::now()->addMonths($subscription->service->plan_period);
                    break;
                case 'Y':
                    $end_at = Carbon::now()->addYears($subscription->service->plan_period);
                    break;
                default:
                    $end_at = Carbon::now()->addDays(1);
                    break;
            }

            if(!$subscription->service->host_id) {
                RoleUser::updateOrCreate([
                    'user_id' => $subscription->user->id,
                ], [
                    'role_id' => $subscription->service->role_id,
                    'end_at' => $end_at
                ]);
            } else {
                $user = User::findOrFail($subscription->service->host_id);
                $user->increment('balance', $subscription->service->price*0.8);
            }
        });
    }

    public function getArtworkUrlAttribute($value)
    {
        $media = $this->getFirstMedia('artwork');
        if(! $media) {
            return null;
        } else {
            if($media->disk == 's3') {
                return $media->getTemporaryUrl(Carbon::now()->addMinutes(intval(config('settings.s3_signed_time', 5))));
            } else {
                return $media->getFullUrl();
            }
        }
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}