<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Default admin credentials (change password after first login in production).
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@a7anayaraa.gallery'],
            [
                'name' => 'A7 ANAYARAA Admin',
                'password' => Hash::make('adminpassword'),
                'is_admin' => true,
            ]
        );
    }
}
