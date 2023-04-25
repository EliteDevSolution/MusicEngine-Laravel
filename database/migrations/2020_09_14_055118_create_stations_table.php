<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stations', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->string('category', 50)->nullable()->index('category');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('country_code', 3)->nullable()->index('country_code');
            $table->integer('city_id')->nullable()->index('city_id');
            $table->mediumInteger('language_id')->nullable()->index('language_id');
            $table->string('stream_url');
            $table->boolean('allow_comments')->default(1)->index('allow_comments');
            $table->mediumInteger('comment_count')->default(0);
            $table->integer('play_count')->default(0)->index('play_count');
            $table->integer('failed_count')->default(0)->index('failed_count');
            $table->boolean('visibility')->default(1);
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
        DB::statement('ALTER TABLE stations ADD FULLTEXT searchcontent (title, description)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stations');
    }
}
