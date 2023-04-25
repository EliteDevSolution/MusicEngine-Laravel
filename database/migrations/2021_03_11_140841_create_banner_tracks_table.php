<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBannerTracksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banner_tracks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('banner_id')->nullable();
            $table->integer('user_id');
            $table->string('ip', 50)->nullable();
            $table->integer('age')->nullable()->index('age');
            $table->string('gender', 10)->nullable()->index('gender');
            $table->string('country_code', 200);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('banner_tracks');
    }
}
