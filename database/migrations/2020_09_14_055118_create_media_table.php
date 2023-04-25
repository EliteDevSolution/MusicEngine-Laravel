<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('media', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->char('uuid', 36)->nullable();
            $table->string('collection_name');
            $table->string('name');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->string('disk');
            $table->string('conversions_disk')->nullable();
            $table->unsignedBigInteger('size');

            $results = \DB::select( DB::raw("select version()") );
            $mysqlVersion =  floatval(preg_replace("/[^0-9.]/", "", $results[0]->{'version()'}));

            if($mysqlVersion < 10) {
                if($mysqlVersion > 5.6) {
                    $table->json('manipulations');
                    $table->json('custom_properties');
                    $table->json('responsive_images');
                } else {
                    $table->longText('manipulations');
                    $table->longText('custom_properties');
                    $table->longText('responsive_images');
                }
            } else {
                if($mysqlVersion > 10.2) {
                    $table->json('manipulations');
                    $table->json('custom_properties');
                    $table->json('responsive_images');
                } else {
                    $table->longText('manipulations');
                    $table->longText('custom_properties');
                    $table->longText('responsive_images');
                }
            }


            $table->unsignedInteger('order_column')->nullable();
            $table->timestamps();
            $table->index(['model_type', 'model_id']);
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
        Schema::dropIfExists('media');
    }
}
