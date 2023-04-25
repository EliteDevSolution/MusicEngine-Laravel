<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHostToServices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->boolean('host_id')->after('id')->nullable()->index();
            $table->boolean('allow_streaming')->after('host_id')->default(0);
            $table->boolean('allow_hd_streaming')->after('host_id')->default(0);
            $table->boolean('allow_download')->after('host_id')->default(0);
            $table->boolean('allow_hd_download')->after('host_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            //
        });
    }
}
