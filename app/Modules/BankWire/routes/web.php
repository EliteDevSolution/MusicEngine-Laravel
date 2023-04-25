<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-06-23
 * Time: 18:10
 */
Route::group(['namespace' => 'Frontend', 'as' => 'frontend.'], function () {
    Route::group(['middleware' => 'auth'], function () {
        Route::get('subscription/bankwire/{id}', '\App\Modules\BankWire\Controller@subscriptionAuthorization')->name('bankwire.subscription.authorization');
        Route::post('subscription/bankwire/callback/{id}', '\App\Modules\BankWire\Controller@subscriptionCallback')->name('bankwire.subscription.callback');

        Route::get('purchase/bankwire/authorization', '\App\Modules\BankWire\Controller@purchaseAuthorization')->name('bankwire.purchase.authorization');
        Route::post('purchase/bankwire/callback', '\App\Modules\BankWire\Controller@purchaseCallback')->name('bankwire.purchase.callback');
    });
});