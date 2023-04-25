<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-06-23
 * Time: 09:52
 */

Route::get('mood/{slug}', 'MoodController@index')->name('mood');
Route::get('mood/{slug}/songs', 'MoodController@songs')->name('mood.songs');
Route::get('mood/{slug}/albums', 'MoodController@albums')->name('mood.albums');
Route::get('mood/{slug}/artists', 'MoodController@artists')->name('mood.artists');
Route::get('mood/{slug}/playlists', 'MoodController@playlists')->name('mood.playlists');
