<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChannelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->nullable();
            $table->smallInteger('priority')->default(0)->index('priority');
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('alt_name')->index('alt_name');
            $table->string('object_ids')->nullable();
            $table->string('object_type', 20);
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->boolean('allow_home')->default(0)->index('allow_home');
            $table->boolean('allow_discover')->default(0)->index('allow_discover');
            $table->boolean('allow_radio')->default(0)->index('allow_radio');
            $table->boolean('allow_community')->default(0)->index('allow_community');
            $table->boolean('allow_trending')->default(0)->index('allow_trending');
            $table->string('genre', 50)->nullable();
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
        Schema::dropIfExists('channels');
    }
}
