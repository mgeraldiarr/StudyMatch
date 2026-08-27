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
            if (!Schema::hasColumn('courses', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn('courses', 'avatar')) {
                $table->string('avatar')->nullable()->after('description');
            }
        });

        Schema::table('messages', function (Blueprint $table) {
            if (!Schema::hasColumn('messages', 'attachment_path')) {
                $table->string('attachment_path')->nullable()->after('message');
            }
            if (!Schema::hasColumn('messages', 'attachment_type')) {
                $table->string('attachment_type')->nullable()->after('attachment_path'); // 'image', 'video', 'document'
            }
            if (!Schema::hasColumn('messages', 'attachment_name')) {
                $table->string('attachment_name')->nullable()->after('attachment_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $courseColumns = array_values(array_filter(['description', 'avatar'], fn ($col) => Schema::hasColumn('courses', $col)));
        if (!empty($courseColumns)) {
            Schema::table('courses', function (Blueprint $table) use ($courseColumns) {
                $table->dropColumn($courseColumns);
            });
        }

        $messageColumns = array_values(array_filter(
            ['attachment_path', 'attachment_type', 'attachment_name'],
            fn ($col) => Schema::hasColumn('messages', $col)
        ));
        if (!empty($messageColumns)) {
            Schema::table('messages', function (Blueprint $table) use ($messageColumns) {
                $table->dropColumn($messageColumns);
            });
        }
    }
};
