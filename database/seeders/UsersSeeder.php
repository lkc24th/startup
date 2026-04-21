<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'phone' => '0123456789',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]
        );
        $admin->assignRole('admin');

        // Create customer users
        $customer1 = User::firstOrCreate(
            ['username' => 'customer1'],
            [
                'phone' => '0987654321',
                'password' => Hash::make('password'),
                'role' => 'customer'
            ]
        );
        $customer1->assignRole('customer');

        $customer2 = User::firstOrCreate(
            ['username' => 'customer2'],
            [
                'phone' => '0912345678',
                'password' => Hash::make('password'),
                'role' => 'customer'
            ]
        );
        $customer2->assignRole('customer');

        $this->command->info('✓ Users created and roles assigned');
    }
}
