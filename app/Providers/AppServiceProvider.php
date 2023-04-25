<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Console\ClientCommand;
use Laravel\Passport\Console\InstallCommand;
use Laravel\Passport\Console\KeysCommand;
use Laravel\Passport\Passport;
use Laravel\Socialite\Contracts\Factory;
use Illuminate\Support\Facades\Schema;
use Cache;
use URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        Passport::routes();

        $this->commands([
            InstallCommand::class,
            ClientCommand::class,
            KeysCommand::class,
        ]);

        if(config('settings.force_https')) {
            URL::forceScheme('https');
        }

        $socialite = $this->app->make(Factory::class);
        $socialite->extend(
            'apple',
            function ($app) use ($socialite) {
                $config = $app['config']['services.sign_in_with_apple'];

                return $socialite
                    ->buildProvider(SignInWithAppleProvider::class, $config);
            }
        );

        $socialite->extend(
            'discord',
            function ($app) use ($socialite) {
                $config = $app['config']['services.discord'];

                return $socialite
                    ->buildProvider(SignInWithDiscordProvider::class, $config);
            }
        );


        if(! Cache::has('languages')) {
            if( ! $handle = opendir(resource_path('lang')) ) {
                die( "Cannot open folder lang in resources folder." );
            }

            $languages = array();
            while ( false !== ($file = readdir( $handle )) ) {
                if( is_dir( resource_path('lang/' . $file)) and ($file != "." and $file != ".." and $file != "vendor") ) {
                    $languages[$file] = trans('langcode.' . $file) ;
                }
            }

            Cache::forever('languages', array_reverse($languages));
        }

    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
