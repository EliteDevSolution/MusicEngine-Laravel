<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-08-01
 * Time: 20:34
 */

Route::get('lyricist/{id}/{slug}', 'LyricistController@index')->name('lyricist');
Route::get('lyricist/{id}/{slug}/albums', 'LyricistController@albums')->name('lyricist.albums');
Route::get('lyricist/{id}/{slug}/similar-lyricist', 'LyricistController@similar')->name('lyricist.similar');
Route::get('lyricist/{id}/{slug}/followers', 'LyricistController@followers')->name('lyricist.followers');