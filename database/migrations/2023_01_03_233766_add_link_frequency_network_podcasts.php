<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLinkFrequencyNetworkPodcasts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('podcasts', function (Blueprint $table) {
            $table->char('link')->after('visibility')->nullable();
            $table->char('frequency', 30)->after('visibility')->nullable();
            $table->char('network', 50)->after('visibility')->nullable()->index();
            $table->char('copyright')->after('visibility')->nullable();
            $table->char('type', 40)->after('visibility')->index()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('podcasts', function (Blueprint $table) {
            //
        });
    }
}
