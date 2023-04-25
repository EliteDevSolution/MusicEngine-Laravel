<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArtistServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('artist_services', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('host_id')->index();
            $table->string('title');
            $table->decimal('price', 10)->nullable()->default(0.00);
            $table->string('description');
            $table->boolean('active')->default(1);
            $table->boolean('allow_streaming')->default(0);
            $table->boolean('allow_hd_streaming')->default(0);
            $table->boolean('allow_download')->default(0);
            $table->boolean('allow_hd_download')->default(0);
            $table->smallInteger('plan_period')->default(0);
            $table->enum('plan_period_format', ['D', 'W', 'M', 'Y']);
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
        Schema::dropIfExists('artist_services');
    }
}
