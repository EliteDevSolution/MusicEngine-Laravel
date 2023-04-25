<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSlidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('slides', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->index('user_id');
            $table->smallInteger('priority')->nullable()->default(0)->index('priority');
            $table->integer('object_id');
            $table->string('object_type', 50)->default('');
            $table->string('title')->nullable();
            $table->string('title_link')->nullable();
            $table->text('description')->nullable();
            $table->boolean('allow_home')->default(0)->index('allow_home');
            $table->boolean('allow_discover')->default(0)->index('allow_discover');
            $table->boolean('allow_radio')->default(0);
            $table->boolean('allow_community')->default(0)->index('allow_community');
            $table->boolean('allow_trending')->default(0)->index('allow_trending');
            $table->string('genre', 50)->nullable()->index('genre');
            $table->string('mood', 50)->nullable()->index('mood');
            $table->string('radio', 50)->nullable()->index('radio');
            $table->boolean('visibility')->default(1)->index('visibility');
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
        Schema::dropIfExists('slides');
    }
}
