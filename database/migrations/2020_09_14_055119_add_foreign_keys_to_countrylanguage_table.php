<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToCountrylanguageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('countrylanguage', function (Blueprint $table) {
            //$table->foreign('country_code', 'countryLanguage_ibfk_1')->references('code')->on('country')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('countrylanguage', function (Blueprint $table) {
            $table->dropForeign('countryLanguage_ibfk_1');
        });
    }
}
