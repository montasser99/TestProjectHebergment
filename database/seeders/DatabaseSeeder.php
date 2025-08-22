<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        // 1. D'abord les utilisateurs (admin et clients)
        $this->call([
            AdminSeeder::class,
        ]);
    }
}