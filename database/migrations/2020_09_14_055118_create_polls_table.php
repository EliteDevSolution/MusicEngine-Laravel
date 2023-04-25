<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('polls', function (Blueprint $table) {
            $table->increments('id');
            $table->string('object_type', 50)->nullable()->index('object_type');
            $table->unsignedInteger('object_id')->nullable()->index('object_id');
            $table->string('title');
            $table->text('body')->nullable();
            $table->mediumInteger('votes')->default(0);
            $table->boolean('multiple')->nullable()->default(0);
            $table->text('answer');
            $table->boolean('visibility')->nullable()->default(1);
            $table->timestamp('started_at')->nullable()->index('started_at');
            $table->timestamp('ended_at')->nullable()->index('ended_at');
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
        Schema::dropIfExists('polls');
    }
}
