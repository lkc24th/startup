<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add missing columns to services table
        if (Schema::hasTable('services')) {
            if (!Schema::hasColumn('services', 'image')) {
                Schema::table('services', function (Blueprint $table) {
                    $table->string('image')->nullable()->after('duration');
                });
            }
            if (!Schema::hasColumn('services', 'is_active')) {
                Schema::table('services', function (Blueprint $table) {
                    $table->boolean('is_active')->default(true)->after('image');
                });
            }
        }

        // Add missing columns to users table
        if (Schema::hasTable('users')) {
            if (!Schema::hasColumn('users', 'phone')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->string('phone')->nullable()->unique()->after('username');
                });
            }
            // role column is already in create_users_table, so we don't need to add it again
        }

        // Add missing columns to appointments table
        if (Schema::hasTable('appointments')) {
            if (!Schema::hasColumn('appointments', 'total_price')) {
                Schema::table('appointments', function (Blueprint $table) {
                    $table->decimal('total_price', 10, 2)->default(0)->after('staff_id');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (Schema::hasColumn('services', 'image')) {
                $table->dropColumn('image');
            }
            if (Schema::hasColumn('services', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });

        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'total_price')) {
                $table->dropColumn('total_price');
            }
        });
    }
};
