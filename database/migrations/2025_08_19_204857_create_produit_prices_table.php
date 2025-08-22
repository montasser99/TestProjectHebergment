<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produit_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_produit')->constrained('produits')->onDelete('cascade');
            $table->foreignId('id_price_methode')->constrained('price_methodes')->onDelete('cascade');
            $table->decimal('price', 8, 3);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produit_prices');
    }
};

