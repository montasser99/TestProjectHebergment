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
        // Vérifier si nous sommes sur MySQL ou SQLite et adapter
        if (DB::getDriverName() === 'mysql') {
            // MySQL : utiliser ENUM
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'client', 'gestionnaire_commande') DEFAULT 'client'");
        } else {
            // SQLite/autres : utiliser une approche compatible
            Schema::table('users', function (Blueprint $table) {
                // SQLite ne supporte pas ENUM, on laisse le VARCHAR existant
                // Le contrôle sera fait au niveau application
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // S'assurer qu'aucun utilisateur n'a le rôle 'gestionnaire_commande'
        DB::table('users')->where('role', 'gestionnaire_commande')->update(['role' => 'client']);
        
        // Remettre l'ENUM à son état original si on est sur MySQL
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'client') DEFAULT 'client'");
        }
        // SQLite : pas besoin de modification de structure
    }
};
