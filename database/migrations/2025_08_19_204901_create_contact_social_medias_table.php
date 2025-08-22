<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_social_medias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_produit')->constrained('produits')->onDelete('cascade');
            $table->string('instagram_page')->nullable();
            $table->string('facebook_page')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('tiktok_page')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_social_medias');
    }
};
