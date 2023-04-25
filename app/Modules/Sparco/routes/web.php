<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-06-23
 * Time: 18:10
 */
Route::group(['namespace' => 'Frontend', 'as' => 'frontend.'], function () {
    Route::group(['middleware' => 'auth'], function () {
        Route::get('subscription/sparco/{id}', '\App\Modules\Sparco\Controller@subscriptionAuthorization')->name('sparco.subscription.authorization');
        Route::get('subscription/sparco/callback/{id}', '\App\Modules\Sparco\Controller@subscriptionCallback')->name('sparco.subscription.callback');

        Route::get('purchase/sparco/authorization', '\App\Modules\Sparco\Controller@purchaseAuthorization')->name('sparco.purchase.authorization');
        Route::get('purchase/sparco/callback', '\App\Modules\Sparco\Controller@purchaseCallback')->name('sparco.purchase.callback');
    });
});