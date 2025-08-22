<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commande_produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            // Supprimé produit_id pour préserver l'historique même si produit supprimé
            $table->string('produit_label'); // Copie du label du produit
            $table->text('produit_description')->nullable(); // Copie de la description
            $table->string('produit_image')->nullable(); // Copie de l'image
            $table->integer('produit_quantity'); // Copie de la quantity originale du produit
            $table->string('produit_unit'); // Copie de l'unité
            $table->string('produit_currency')->default('TND'); // Copie de la devise
            $table->decimal('prix_unitaire', 8, 3); // Prix au moment de la commande
            $table->integer('quantite_commandee'); // Quantité commandée par le client
            $table->decimal('sous_total', 10, 3); // prix_unitaire * quantite_commandee
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commande_produits');
    }
};