<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAllowSellToSongsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('songs', function (Blueprint $table) {
            $table->boolean('flac')->default(0)->after('mp3')->index('flac');
            $table->boolean('wav')->default(0)->after('mp3')->index('wav');
            $table->decimal('price', 10)->nullable()->after('user_id')->default(0.00);
            $table->boolean('selling')->default(0)->after('user_id')->index('selling');
            $table->boolean('pending')->default(0)->after('approved')->index('pending');
            $table->boolean('explicit')->default(0)->after('user_id')->index('explicit');
            $table->string('access')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('songs', function (Blueprint $table) {
            //
        });
    }
}
