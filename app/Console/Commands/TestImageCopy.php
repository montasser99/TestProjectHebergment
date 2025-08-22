<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestImageCopy extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:image-copy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test la copie d\'images vers le dossier commandes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Test de copie d\'image...');
        
        // Récupérer un produit avec une image
        $produit = \App\Models\Produit::whereNotNull('image')->first();
        
        if (!$produit) {
            $this->error('Aucun produit avec image trouvé');
            return;
        }
        
        $this->info("Produit trouvé: {$produit->label}");
        $this->info("Image originale: {$produit->image}");
        
        // Vérifier que l'image source existe
        $sourcePath = $produit->image;
        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($sourcePath)) {
            $this->error("L'image source n'existe pas: {$sourcePath}");
            return;
        }
        
        $this->info("Image source confirmée: {$sourcePath}");
        
        // Test de copie
        $commandeId = 999; // ID de test
        $newFileName = "commande_{$commandeId}_produit_{$produit->id}_test.webp";
        $destinationPath = 'commandes/' . $newFileName;
        
        $this->info("Tentative copie vers: {$destinationPath}");
        
        if (\Illuminate\Support\Facades\Storage::disk('public')->copy($sourcePath, $destinationPath)) {
            $this->info('✅ Copie réussie!');
            $this->info("Image copiée: commandes/{$newFileName}");
            
            // Vérifier que le fichier existe
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($destinationPath)) {
                $this->info('✅ Fichier confirmé dans le stockage');
            } else {
                $this->error('❌ Fichier non trouvé après copie');
            }
        } else {
            $this->error('❌ Échec de la copie');
        }
    }
}
