<?php


namespace App\Advert;

use App\Models\Banner;
use Cache;
use Carbon\Carbon;
use App\Models\Role;

class Advert
{
    public function get($tag)
    {
        if(Cache::has('banners')) {
            $banners = Cache::get('banners');
        } else {
            $banners = Banner::all();
            Cache::forever('banners', $banners);
        }
        if(isset($banners->firstWhere('banner_tag', $tag)->id)) {
            $banner = $banners->firstWhere('banner_tag', $tag);
            if((! $banner->started_at || $banner->started_at < Carbon::now()) || ($banner->ended_at || $banner->ended_at > Carbon::now())) {
                if(Role::getValue('ad_support') && $banner->approved){
                    return $banner->code;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } else {
            return '';
        }
    }
}