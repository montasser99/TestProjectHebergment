<?php
// AdminSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un administrateur seulement s'il n'existe pas déjà
        if (!User::where('email', 'ghayth.amazighi@gmail.com')->exists()) {
            User::create([
                'name' => 'Admin System',
                'email' => 'ghayth.amazighi@gmail.com', 
                'phone' => '+216 71 123 456',
                'password' => Hash::make('Ghayth2007@'),
                'role' => 'admin',
                'is_blocked' => false,
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('Admin user created successfully!');
        } else {
            $this->command->info('Admin user already exists, skipping...');
        }
    }
}