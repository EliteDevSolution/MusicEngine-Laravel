<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedSmallInteger('parent_id')->nullable()->index('parent_id');
            $table->mediumInteger('reply_count')->default(0);
            $table->integer('user_id')->index('user_id');
            $table->integer('commentable_id')->nullable()->index('object_id');
            $table->string('commentable_type', 50)->nullable()->index('object_type');
            $table->text('content')->nullable();
            $table->tinyInteger('edited')->default(0);
            $table->string('ip', 46)->nullable();
            $table->mediumInteger('reaction_count')->default(0);
            $table->boolean('approved')->default(1)->index('approve');
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
        Schema::dropIfExists('comments');
    }
}
