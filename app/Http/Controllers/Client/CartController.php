<?php
// App/Http/Controllers/Client/CartController.php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\PriceMethode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Afficher le panier
     */
    public function index(Request $request)
    {
        // Vérifier que l'utilisateur peut accéder à l'interface client
        if (auth()->user()->role === 'gestionnaire_commande') {
            return redirect()->route('unauthorized');
        }
        
        return Inertia::render('Client/Cart');
    }

    /**
     * Obtenir les informations d'un produit pour le panier
     * SÉCURISÉ : Vérifie que le produit a bien un prix pour la méthode de paiement demandée
     */
    public function getProductInfo(Request $request)
    {
        // Vérifier que l'utilisateur peut accéder à l'interface client
        if (auth()->user()->role === 'gestionnaire_commande') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:produits,id',
            'payment_method_id' => 'required|integer|exists:price_methodes,id',
        ]);

        // Vérifier que la méthode de paiement existe et est active
        $paymentMethod = PriceMethode::find($validated['payment_method_id']);
        if (!$paymentMethod) {
            return response()->json([
                'error' => 'Méthode de paiement invalide',
                'code' => 'INVALID_PAYMENT_METHOD'
            ], 400);
        }

        // Récupérer le produit avec ses prix pour cette méthode spécifique
        $produit = Produit::with([
            'typeProduit',
            'produitPrices' => function($q) use ($validated) {
                $q->where('id_price_methode', $validated['payment_method_id']);
            }
        ])->find($validated['product_id']);

        // Vérifications de sécurité
        if (!$produit) {
            return response()->json([
                'error' => 'Produit non trouvé',
                'code' => 'PRODUCT_NOT_FOUND'
            ], 404);
        }

        if ($produit->produitPrices->isEmpty()) {
            return response()->json([
                'error' => "Le produit '" . $produit->label . "' n'a pas de prix configuré pour la méthode de paiement '" . $paymentMethod->methode_name . "'",
                'code' => 'NO_PRICE_FOR_PAYMENT_METHOD',
                'product_name' => $produit->label,
                'payment_method' => $paymentMethod->methode_name
            ], 400);
        }

        $priceRecord = $produit->produitPrices->first();
        
        // Vérifier que le prix est valide
        if ($priceRecord->price <= 0) {
            return response()->json([
                'error' => "Prix invalide pour le produit '" . $produit->label . "'",
                'code' => 'INVALID_PRICE'
            ], 400);
        }

        // Retourner les informations validées
        return response()->json([
            'success' => true,
            'product' => [
                'id' => $produit->id,
                'label' => $produit->label,
                'description' => $produit->description,
                'image' => $produit->image,
                'quantity' => $produit->quantity,
                'unit' => $produit->unit,
                'currency' => $produit->currency,
                'price' => $priceRecord->price,
                'type_name' => $produit->typeProduit->name ?? null,
                'payment_method' => $paymentMethod->methode_name,
            ]
        ]);
    }

    /**
     * Valider si un produit peut être ajouté au panier pour une méthode de paiement donnée
     * Cette méthode peut être appelée avant l'ajout au panier côté frontend
     */
    public function validateProductForCart(Request $request)
    {
        // Vérifier que l'utilisateur peut accéder à l'interface client
        if (auth()->user()->role === 'gestionnaire_commande') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:produits,id',
            'payment_method_id' => 'required|integer|exists:price_methodes,id',
            'quantity' => 'required|integer|min:1|max:999',
        ]);

        try {
            // Récupérer la méthode de paiement
            $paymentMethod = PriceMethode::find($validated['payment_method_id']);
            if (!$paymentMethod) {
                return response()->json([
                    'valid' => false,
                    'error' => 'Méthode de paiement invalide',
                    'code' => 'INVALID_PAYMENT_METHOD'
                ]);
            }

            // Récupérer le produit avec son prix pour cette méthode
            $produit = Produit::with([
                'produitPrices' => function($q) use ($validated) {
                    $q->where('id_price_methode', $validated['payment_method_id']);
                }
            ])->find($validated['product_id']);

            if (!$produit) {
                return response()->json([
                    'valid' => false,
                    'error' => 'Produit non trouvé',
                    'code' => 'PRODUCT_NOT_FOUND'
                ]);
            }

            // Validation critique : Le produit doit avoir un prix pour cette méthode
            if ($produit->produitPrices->isEmpty()) {
                return response()->json([
                    'valid' => false,
                    'error' => "Le produit '{$produit->label}' n'a pas de prix configuré pour la méthode de paiement '{$paymentMethod->methode_name}'",
                    'code' => 'NO_PRICE_FOR_PAYMENT_METHOD',
                    'product_name' => $produit->label,
                    'payment_method' => $paymentMethod->methode_name
                ]);
            }

            $price = $produit->produitPrices->first()->price;
            if ($price <= 0) {
                return response()->json([
                    'valid' => false,
                    'error' => "Prix invalide pour le produit '{$produit->label}'",
                    'code' => 'INVALID_PRICE'
                ]);
            }

            // Si tout est valide
            return response()->json([
                'valid' => true,
                'message' => 'Produit valide pour ajout au panier',
                'data' => [
                    'product_name' => $produit->label,
                    'price' => $price,
                    'currency' => $produit->currency ?? 'TND',
                    'subtotal' => $price * $validated['quantity'],
                    'payment_method' => $paymentMethod->methode_name
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'error' => 'Erreur lors de la validation',
                'code' => 'VALIDATION_ERROR',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
