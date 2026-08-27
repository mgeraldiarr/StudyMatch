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
        Schema::table('courses', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('avatar')->nullable()->after('description');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->string('attachment_path')->nullable()->after('message');
            $table->string('attachment_type')->nullable()->after('attachment_path'); // 'image', 'video', 'document'
            $table->string('attachment_name')->nullable()->after('attachment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['description', 'avatar']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['attachment_path', 'attachment_type', 'attachment_name']);
        });
    }
};
