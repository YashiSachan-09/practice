<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Default admin credentials (change password after first login in production).
     * Password must be plain: the User model hashes via the `password` => `hashed` cast.
     */
    public function run(): void
    {
        $attrs = [
            'name' => 'A7 ANAYARAA Admin',
            'password' => 'adminpassword',
            'is_admin' => true,
        ];

        User::query()
            ->where('email', 'admin@anayra.gallery')
            ->where('is_admin', true)
            ->update(['email' => 'admin@a7anayaraa.gallery', 'name' => $attrs['name']]);

        User::query()->updateOrCreate(
            ['email' => 'admin@a7anayaraa.gallery'],
            $attrs
        );
    }
}
