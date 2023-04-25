<?php

namespace App\Models;

use App\Scopes\PaymentStatusScope;
use App\Traits\SanitizedRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Order extends Model implements HasMedia
{
    use InteractsWithMedia, SanitizedRequest;

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new PaymentStatusScope);
    }

    protected static function booted()
    {
        static::created(function ($order) {
            $model = (new $order->orderable_type)->findOrFail($order->orderable_id);
            if($model->user_id) {
                $commission = (intval(Role::getUserValue('monetization_sale_cut', $model->user_id)) * $order->amount) / 100;
                $model->user()->increment('balance', $commission);
                $order->commission = $commission;
                $order->save();

                if($order->orderable_type == 'App\Models\Song') {
                    $model->increment('sale_impression', $commission);
                }
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

    public function getObjectAttribute()
    {
        return (new $this->orderable_type)::find($this->orderable_id);
    }
}