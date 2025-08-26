<?php

// Test Brevo SMTP
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Mail;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    Mail::raw('Test Brevo depuis Laravel - ' . date('Y-m-d H:i:s'), function($message) {
        $message->to('amazighishoop@gmail.com')
               ->subject('Test Brevo SMTP Configuration');
    });
    
    echo "✅ Email envoyé avec succès via Brevo!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur d'envoi: " . $e->getMessage() . "\n";
}