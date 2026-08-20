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
        Schema::create('threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('channel'); // e.g. Pemrograman, Matematika, Sains, Desain, Bahasa, Humaniora
            $table->string('title');
            $table->text('body');
            $table->integer('votes')->default(0);
            $table->integer('views')->default(1);
            $table->boolean('is_solved')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();

            $table->index('channel');
            $table->index('created_at');
        });

        Schema::create('thread_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('thread_id')->constrained('threads')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamps();

            $table->index('thread_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thread_replies');
        Schema::dropIfExists('threads');
    }
};
