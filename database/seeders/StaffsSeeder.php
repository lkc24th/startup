<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StaffsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Staff::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Nhân viên mặc định',
                'specialty' => 'Nail',
            ]
        );
    }
}
