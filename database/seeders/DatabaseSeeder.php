<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Appointment;
use App\Models\AppointmentDetail;
use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        // ]);

        $this->call([
            PermissionSeeder::class,
            UsersSeeder::class,
            StaffsSeeder::class,
            ServiceSeeder::class,
            AppointmentsSeeder::class,
            AppointmentDetailsSeeder::class,

        ]);
    }
}
