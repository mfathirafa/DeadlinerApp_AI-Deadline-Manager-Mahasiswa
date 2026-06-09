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
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'difficulty')) {
                $table->tinyInteger('difficulty')->default(3)->after('deadline');
            }
            if (!Schema::hasColumn('tasks', 'estimated_hours')) {
                $table->decimal('estimated_hours', 4, 1)->default(2.0)->after('difficulty');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (Schema::hasColumn('tasks', 'difficulty')) {
                $table->dropColumn('difficulty');
            }
            if (Schema::hasColumn('tasks', 'estimated_hours')) {
                $table->dropColumn('estimated_hours');
            }
        });
    }
};
