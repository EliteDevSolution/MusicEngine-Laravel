<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAlbumSpotifyLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('album_spotify_logs', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('album_id')->index('album_id');
            $table->string('spotify_id', 30)->nullable()->unique();
            $table->string('artwork_url')->nullable();
            $table->boolean('fetched')->default(0)->index('fetched');
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
        Schema::dropIfExists('album_spotify_logs');
    }
}
