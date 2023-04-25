<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Http\Request;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(Request $request)
    {

        if($request->header('Authorization')) {
            Broadcast::routes(["middleware" => "auth:api"]);
        } else {
            Broadcast::routes();
        }

        require base_path('routes/channels.php');
    }
}
