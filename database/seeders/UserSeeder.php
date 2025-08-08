<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Asegúrate de que los roles existan
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);

        // Usuario Admin
        $admin = User::create([
            'email' => 'admin@red.com.sv',
            'client_name' => 'Admin company',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Usuario Normal
        $user = User::create(
            ['email' => 'user@red.com.sv',
            'client_name' => 'User company',
            'password' => Hash::make('password'),
            ]
        );
        $user->assignRole('user');
    }
}
