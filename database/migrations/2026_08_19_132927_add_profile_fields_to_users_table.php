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
        Schema::table('users', function (Blueprint $table) {
            $table->text('avatar')->nullable()->after('password');
            $table->string('university')->nullable()->after('avatar');
            $table->string('major')->nullable()->after('university');
            $table->string('academic_year')->nullable()->after('major');
            $table->string('academic_status')->nullable()->after('academic_year');
            $table->text('bio')->nullable()->after('academic_status');
            $table->string('learning_style')->nullable()->after('bio');
            $table->json('goals')->nullable()->after('learning_style');
            $table->json('weekly_availability')->nullable()->after('goals');
            $table->boolean('is_online')->default(false)->after('weekly_availability');
            $table->timestamp('last_active_at')->nullable()->after('is_online');
            $table->boolean('is_profile_completed')->default(false)->after('last_active_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'university',
                'major',
                'academic_year',
                'academic_status',
                'bio',
                'learning_style',
                'goals',
                'weekly_availability',
                'is_online',
                'last_active_at',
                'is_profile_completed',
            ]);
        });
    }
};
