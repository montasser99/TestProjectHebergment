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
        if (!User::where('email', 'admin@amazighi.tn')->exists()) {
            User::create([
                'name' => 'Admin System',
                'email' => 'admin@amazighi.tn', 
                'phone' => '+216 71 123 456',
                'password' => Hash::make('admin123'),
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