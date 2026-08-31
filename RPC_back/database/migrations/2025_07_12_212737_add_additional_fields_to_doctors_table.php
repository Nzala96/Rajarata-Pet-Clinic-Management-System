<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('specialization')->nullable()->after('dtp');
            $table->integer('experience')->nullable()->after('specialization');
            $table->text('education')->nullable()->after('experience');
            $table->boolean('available')->default(true)->after('education');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['specialization', 'experience', 'education', 'available']);
        });
    }
};
