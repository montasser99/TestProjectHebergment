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
        // Créer un administrateur
        User::create([
            'name' => 'Admin System',
            'email' => 'admin@amazighi.tn',
            'phone' => '+216 71 123 456',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_blocked' => false, // Ajouté
            'email_verified_at' => now(),
        ]);
    }
}