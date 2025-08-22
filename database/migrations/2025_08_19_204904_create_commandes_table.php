<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('client_facebook')->nullable();
            $table->string('client_instagram')->nullable();
            $table->decimal('total_amount', 10, 3);
            // Supprimé payment_method_id pour éviter les problèmes de suppression
            $table->string('payment_method_name'); // Historique seulement
            $table->text('notes_client')->nullable();
            $table->text('notes_admin')->nullable();
            $table->enum('statut', ['en_attente', 'confirme', 'annuler'])->default('en_attente');
            $table->timestamp('date_commande')->useCurrent();
            $table->timestamp('date_confirmation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};