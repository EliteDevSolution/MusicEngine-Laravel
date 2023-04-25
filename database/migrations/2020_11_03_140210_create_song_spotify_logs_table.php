<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSongSpotifyLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('song_spotify_logs', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('song_id')->index('song_id');
            $table->string('spotify_id', 30)->nullable()->unique();
            $table->string('artwork_url')->nullable();
            $table->string('preview_url')->nullable();
            $table->string('youtube', 12)->nullable();
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('song_spotify_logs');
    }
}
