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
        return Inertia::render('Client/Cart');
    }

    /**
     * Obtenir les informations d'un produit pour le panier
     */
    public function getProductInfo(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:produits,id',
            'payment_method_id' => 'required|exists:price_methodes,id',
        ]);

        $produit = Produit::with([
            'typeProduit',
            'produitPrices' => function($q) use ($validated) {
                $q->where('id_price_methode', $validated['payment_method_id']);
            }
        ])->find($validated['product_id']);

        if (!$produit || $produit->produitPrices->isEmpty()) {
            return response()->json(['error' => 'Produit non trouvé ou prix non disponible'], 404);
        }

        return response()->json([
            'id' => $produit->id,
            'label' => $produit->label,
            'description' => $produit->description,
            'image' => $produit->image,
            'quantity' => $produit->quantity,
            'unit' => $produit->unit,
            'currency' => $produit->currency,
            'price' => $produit->produitPrices->first()->price,
            'type_name' => $produit->typeProduit->name ?? null,
        ]);
    }
}
