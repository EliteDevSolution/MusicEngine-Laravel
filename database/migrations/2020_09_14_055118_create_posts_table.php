<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->integer('id', true);
            $table->integer('user_id')->nullable()->index('autor');
            $table->string('title');
            $table->string('alt_name')->default('')->index('alt_name');
            $table->mediumText('short_content')->nullable();
            $table->mediumText('full_content')->nullable();
            $table->string('category')->nullable()->index('category');
            $table->integer('view_count')->nullable()->default(0);
            $table->boolean('allow_comments')->default(1);
            $table->unsignedMediumInteger('comment_count')->default(0)->index('comm_num');
            $table->boolean('allow_main')->unsigned()->default(1)->index('allow_main');
            $table->boolean('disable_index')->nullable()->default(0);
            $table->boolean('fixed')->default(0)->index('fixed');
            $table->string('tags')->nullable()->index('tags');
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->string('access')->nullable();
            $table->boolean('visibility')->default(1)->index('visibility');
            $table->boolean('approved')->default(0)->index('approve');
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
        DB::statement('ALTER TABLE posts ADD FULLTEXT article (short_content, full_content, title)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
