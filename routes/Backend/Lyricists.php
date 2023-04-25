<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-06-23
 * Time: 09:56
 */

/*
 * Edit Artist
*/
Route::group(['middleware' => 'role:admin_artists'], function() {
    Route::get('lyricists', 'LyricistsController@index')->name('lyricists');
    Route::post('lyricists', 'LyricistsController@massAction')->name('lyricists.mass.action');
    Route::get('lyricists/add', 'LyricistsController@add')->name('lyricists.add');
    Route::post('lyricists/add', 'LyricistsController@addPost')->name('lyricists.add.post');
    Route::get('lyricists/edit/{id}', 'LyricistsController@edit')->name('lyricists.edit');
    Route::post('lyricists/edit/{id}', 'LyricistsController@editPost')->name('lyricists.edit.post');
    Route::get('lyricists/delete/{id}', 'LyricistsController@delete')->name('lyricists.delete');
});
