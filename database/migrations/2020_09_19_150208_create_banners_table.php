<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->smallInteger('id', true);
            $table->string('banner_tag');
            $table->string('description')->nullable();
            $table->text('code');
            $table->boolean('approved')->default(0);
            $table->boolean('short_place')->default(0);
            $table->boolean('bstick')->default(0);
            $table->boolean('main')->default(0);
            $table->string('category')->nullable();
            $table->string('group_level', 100)->default('all');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->boolean('fpage')->default(0);
            $table->boolean('innews')->default(0);
            $table->string('device_level', 10)->default('');
            $table->boolean('allow_views')->default(0);
            $table->integer('max_views')->default(0);
            $table->boolean('allow_counts')->default(0);
            $table->integer('max_counts')->default(0);
            $table->integer('views')->default(0);
            $table->integer('clicks')->default(0);
            $table->mediumInteger('rubric')->default(0);
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
        Schema::dropIfExists('banners');
    }
}
