<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modifier l'ENUM pour ajouter le rôle 'gestionnaire_commande'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'client', 'gestionnaire_commande') DEFAULT 'client'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remettre l'ENUM à son état original
        // D'abord, s'assurer qu'aucun utilisateur n'a le rôle 'gestionnaire_commande'
        DB::table('users')->where('role', 'gestionnaire_commande')->update(['role' => 'client']);
        
        // Puis modifier l'ENUM pour supprimer le rôle
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'client') DEFAULT 'client'");
    }
};
