<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePopularTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('popular', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('song_id')->nullable()->default(0);
            $table->integer('artist_id')->nullable()->index('artist_id');
            $table->smallInteger('plays')->default(0);
            $table->smallInteger('favorites')->default(0);
            $table->smallInteger('collections')->default(0);
            $table->date('created_at')->nullable();
            $table->unique(['song_id', 'created_at'], 'trackId');
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
        Schema::dropIfExists('popular');
    }
}
