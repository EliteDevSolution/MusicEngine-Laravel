<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreAnalyticToPopular extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('popular', function (Blueprint $table) {
            $table->integer('album_id')->after('artist_id')->index('album_id')->nullable();
            $table->integer('podcast_id')->after('artist_id')->index('podcast_id')->nullable();
            $table->integer('episode_id')->after('artist_id')->index('episode_id')->nullable();
            $table->integer('station_id')->after('artist_id')->index('station_id')->nullable();
            $table->integer('playlist_id')->after('artist_id')->index('playlist_id')->nullable();
            $table->string('genre', 50)->after('artist_id')->index('genre')->nullable();
            $table->string('mood', 50)->after('artist_id')->index('mood')->nullable();
            $table->index(['podcast_id', 'created_at'], 'podcastId');
            $table->index(['episode_id', 'created_at'], 'episodeId');
            $table->index(['station_id', 'created_at'], 'stationId');
            $table->index(['album_id', 'created_at'], 'albumId');
            $table->index(['playlist_id', 'created_at'], 'playlistId');
            $table->dropUnique('trackId');
            $table->index(['song_id', 'created_at'], 'trackId');
            $table->integer('song_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('popular', function (Blueprint $table) {

        });
    }
}
