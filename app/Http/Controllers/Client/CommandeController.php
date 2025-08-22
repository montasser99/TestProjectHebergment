<?php
// App/Http/Controllers/Client/CommandeController.php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\CommandeProduit;
use App\Models\Produit;
use App\Models\PriceMethode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CommandeController extends Controller
{
    /**
     * Copier l'image d'un produit vers le dossier commandes
     */
    private function copyProductImageToCommands($productImage, $commandeId, $produitId)
    {
        if (!$productImage) {
            Log::info("Aucune image à copier pour produit {$produitId}");
            return null;
        }

        try {
            Log::info("Tentative copie image: {$productImage} pour commande {$commandeId}, produit {$produitId}");
            
            // Chemin source de l'image du produit
            $sourcePath = $productImage;
            
            // Vérifier que l'image source existe
            if (!Storage::disk('public')->exists($sourcePath)) {
                Log::error("Image source n'existe pas: {$sourcePath}");
                return null;
            }

            // Créer le nom du fichier pour la commande (avec ID commande et produit pour éviter les conflits)
            $fileInfo = pathinfo($productImage);
            $extension = $fileInfo['extension'] ?? 'jpg';
            $newFileName = "commande_{$commandeId}_produit_{$produitId}_" . Str::random(8) . '.' . $extension;
            
            // Chemin destination dans le dossier commandes
            $destinationPath = 'commandes/' . $newFileName;
            
            Log::info("Copie de {$sourcePath} vers {$destinationPath}");
            
            // Copier l'image
            if (Storage::disk('public')->copy($sourcePath, $destinationPath)) {
                // Retourner le chemin relatif pour la base de données (sans 'public/')
                $result = 'commandes/' . $newFileName;
                Log::info("Copie réussie: {$result}");
                return $result;
            }
            
            Log::error("Échec de la copie de {$sourcePath} vers {$destinationPath}");
            return null;
        } catch (\Exception $e) {
            // En cas d'erreur, on retourne null plutôt que de faire échouer la commande
            Log::error('Erreur lors de la copie d\'image de commande: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return null;
        }
    }

    /**
     * Nettoyer les images de commandes orphelines (optionnel - pour maintenance)
     */
    public function cleanupOrphanedCommandeImages()
    {
        try {
            // Récupérer tous les chemins d'images utilisées dans les commandes
            $usedImages = CommandeProduit::whereNotNull('produit_image')
                                       ->where('produit_image', 'like', 'commandes/%')
                                       ->pluck('produit_image')
                                       ->unique()
                                       ->toArray();

            // Récupérer tous les fichiers dans le dossier commandes
            $allFiles = Storage::disk('public')->files('commandes');

            $deletedCount = 0;
            foreach ($allFiles as $file) {
                // Si le fichier n'est pas utilisé dans une commande, le supprimer
                if (!in_array($file, $usedImages)) {
                    Storage::disk('public')->delete($file);
                    $deletedCount++;
                }
            }

            Log::info("Nettoyage des images de commandes: {$deletedCount} fichiers supprimés");
            return $deletedCount;

        } catch (\Exception $e) {
            Log::error('Erreur lors du nettoyage des images de commandes: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Afficher le formulaire de commande (checkout)
     */
    public function checkout(Request $request)
    {
        $paymentMethodId = $request->input('payment_method_id');
        
        if (!$paymentMethodId) {
            return redirect()->route('home');
        }

        $selectedPaymentMethod = PriceMethode::find($paymentMethodId);

        return Inertia::render('Client/Checkout', [
            'selectedPaymentMethod' => $selectedPaymentMethod,
            'paymentMethodId' => $paymentMethodId,
        ]);
    }

    /**
     * Créer une commande
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method_id' => 'required|exists:price_methodes,id',
            'client_facebook' => 'nullable|string|max:255',
            'client_instagram' => 'nullable|string|max:255',
            'notes_client' => 'nullable|string|max:1000',
            'cart_items' => 'required|array|min:1',
            'cart_items.*.product_id' => 'required|exists:produits,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
        ]);

        // Vérifier que l'utilisateur a au moins un contact social ou des notes
        if (!$validated['client_facebook'] && !$validated['client_instagram'] && !$validated['notes_client']) {
            return back()->withErrors(['contact' => 'Veuillez fournir au moins un moyen de contact (Facebook, Instagram) ou des notes.']);
        }

        DB::beginTransaction();
        
        try {
            $totalAmount = 0;
            $cartDetails = [];

            // Calculer le total et préparer les détails
            foreach ($validated['cart_items'] as $item) {
                $produit = Produit::with(['produitPrices' => function($q) use ($validated) {
                    $q->where('id_price_methode', $validated['payment_method_id']);
                }])->find($item['product_id']);

                if (!$produit || $produit->produitPrices->isEmpty()) {
                    throw new \Exception("Produit non disponible: " . $item['product_id']);
                }

                $price = $produit->produitPrices->first()->price;
                $subtotal = $price * $item['quantity'];
                $totalAmount += $subtotal;

                $cartDetails[] = [
                    'produit' => $produit,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ];
            }

            $paymentMethod = PriceMethode::find($validated['payment_method_id']);

            // Créer la commande
            $commande = Commande::create([
                'user_id' => Auth::id(),
                'client_facebook' => $validated['client_facebook'],
                'client_instagram' => $validated['client_instagram'],
                'total_amount' => $totalAmount,
                'payment_method_name' => $paymentMethod->methode_name,
                'notes_client' => $validated['notes_client'],
                'statut' => 'en_attente',
                'date_commande' => now(),
            ]);

            // Créer les lignes de commande
            foreach ($cartDetails as $detail) {
                $produit = $detail['produit'];
                
                Log::info("Traitement produit {$produit->id} - Image originale: {$produit->image}");
                
                // Copier l'image du produit vers le dossier commandes
                $commandeImagePath = $this->copyProductImageToCommands(
                    $produit->image, 
                    $commande->id, 
                    $produit->id
                );
                
                // Déterminer quelle image utiliser
                $finalImagePath = $commandeImagePath ?: $produit->image;
                
                Log::info("Image finale utilisée pour produit {$produit->id}: {$finalImagePath}");
                
                CommandeProduit::create([
                    'commande_id' => $commande->id,
                    'produit_label' => $produit->label,
                    'produit_description' => $produit->description,
                    'produit_image' => $finalImagePath,
                    'produit_quantity' => $produit->quantity,
                    'produit_unit' => $produit->unit,
                    'produit_currency' => $produit->currency,
                    'prix_unitaire' => $detail['price'],
                    'quantite_commandee' => $detail['quantity'],
                    'sous_total' => $detail['subtotal'],
                ]);
            }

            DB::commit();

            return redirect()->route('client.orders.success', $commande->id)
                           ->with('message', 'Commande créée avec succès !');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Erreur lors de la création de la commande: ' . $e->getMessage()]);
        }
    }

    /**
     * Page de confirmation de commande
     */
    public function success(Commande $commande)
    {
        // Vérifier que la commande appartient à l'utilisateur connecté
        if ($commande->user_id !== Auth::id()) {
            abort(403);
        }

        $commande->load('commandeProduits');

        return Inertia::render('Client/OrderSuccess', [
            'commande' => $commande,
        ]);
    }

    /**
     * Historique des commandes de l'utilisateur
     */
    public function history()
    {
        $commandes = Commande::where('user_id', Auth::id())
                            ->with('commandeProduits')
                            ->latest('date_commande')
                            ->paginate(5);

        return Inertia::render('Client/OrderHistory', [
            'commandes' => $commandes,
        ]);
    }
}