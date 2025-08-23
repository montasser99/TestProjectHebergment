<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('email', 191);
            $table->string('code', 6);
            $table->enum('type', ['signup', 'reset_password'])->default('signup');
            $table->timestamp('expires_at');
            $table->boolean('verified')->default(false);
            $table->text('user_data')->nullable(); // Stockage temporaire des données utilisateur pour signup
            $table->timestamps();
            
            $table->index(['email', 'type']);
            $table->index('code');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_verifications');
    }
};
