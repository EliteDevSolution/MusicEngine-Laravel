<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCountrylanguageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('countrylanguage', function (Blueprint $table) {
            $table->integer('id', true);
            $table->char('country_code', 3)->default('')->index('CountryCode');
            $table->char('name', 30)->default('');
            $table->enum('is_official', ['T', 'F'])->default('F');
            $table->boolean('fixed')->default(0)->index('fixed');
            $table->boolean('visibility')->default(1)->index('visibility');
            $table->timestamps();
            $table->index(['country_code', 'name'], 'country_code');
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
        Schema::dropIfExists('countrylanguage');
    }
}
