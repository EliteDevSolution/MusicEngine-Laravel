<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reactions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('reactionable_id')->nullable();
            $table->string('reactionable_type', 50)->nullable();
            $table->string('type', 20)->nullable()->index('reaction_type');
            $table->timestamps();
            $table->unique(['user_id', 'reactionable_id', 'reactionable_type'], 'REACTION_UNIQUE');
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
        Schema::dropIfExists('reactions');
    }
}
