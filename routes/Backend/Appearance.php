<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-06-23
 * Time: 09:59
 */

Route::group(['middleware' => 'role:admin_settings'], function() {
    Route::get('appearance', 'AppearanceController@index')->name('appearance');
    Route::post('appearance', 'AppearanceController@save')->name('appearance.save.post');
});