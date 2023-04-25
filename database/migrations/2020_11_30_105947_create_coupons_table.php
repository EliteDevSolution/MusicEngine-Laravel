<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 50)->unique('code');
            $table->enum('type', ['percentage', 'fixed'])->nullable();
            $table->string('description')->nullable();
            $table->unsignedInteger('amount')->nullable();
            $table->integer('use_count')->default(0);
            $table->integer('usage_limit')->nullable();
            $table->integer('minimum_spend')->nullable();
            $table->integer('maximum_spend')->nullable();
            $table->string('access')->nullable();
            $table->boolean('approved')->default(1);
            $table->timestamps();
            $table->timestamp('expired_at')->nullable();
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
        Schema::dropIfExists('coupons');
    }
}
