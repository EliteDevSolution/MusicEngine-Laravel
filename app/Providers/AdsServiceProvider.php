<?php


namespace App\Providers;

use App\Advert\Facade\AdvertFacade;
use Carbon\Carbon;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Cache;
//use App\Models\Banner;
use App\Models\Role;
use App\Advert\Advert;

class AdsServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('advert', function () {
            return new Advert();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

    }
}
