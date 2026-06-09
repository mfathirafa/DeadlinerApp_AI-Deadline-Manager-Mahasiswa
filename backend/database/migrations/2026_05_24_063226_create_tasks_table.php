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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');                    // ← ganti name → title
            $table->text('description')->nullable();    // ← tambah
            $table->dateTime('deadline');
            $table->integer('progress')->default(0);   // ← tambah (0-100)
            $table->enum('status', [
                'pending',
                'in_progress',
                'completed',
                'overdue'                              // ← tambah
            ])->default('pending');
            $table->enum('priority', [
                'low', 'medium', 'high', 'critical'   // ← tambah
            ])->default('medium');

            // Kolom AI
            $table->integer('ai_priority_score')->nullable();
            $table->text('ai_analysis')->nullable();   // ← ganti ai_recommendation → ai_analysis
            $table->date('ai_suggested_start')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
