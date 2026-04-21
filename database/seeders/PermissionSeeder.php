<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Define permissions
        $permissions = [
            // Services permissions
            'view_services',
            'create_services',
            'edit_services',
            'delete_services',

            // Appointments permissions
            'view_appointments',
            'view_all_appointments',
            'create_appointments',
            'edit_appointments',
            'confirm_appointments',
            'reject_appointments',
            'cancel_appointments',
            'reschedule_appointments',
            'change_appointment_status',

            // Customers permissions
            'view_customers',
            'view_customer_details',
            'search_customers',

            // Settings permissions
            'view_settings',
            'edit_settings',

            // Staff permissions
            'manage_staff',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::where('guard_name', 'web')->get());

        // Create customer role
        $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
        $customerRole->syncPermissions([
            'view_services',
            'create_appointments',
            'view_appointments',
            'cancel_appointments',
        ]);

        $this->command->info('✓ Roles and permissions created successfully');
    }
}
