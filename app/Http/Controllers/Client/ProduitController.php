<?php
// App/Http/Controllers/Client/ProduitController.php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduitController extends Controller
{
    /**
     * Afficher les détails d'un produit
     */
    public function show(Request $request, Produit $produit)
    {
        $paymentMethodId = $request->input('payment_method_id');
        
        if (!$paymentMethodId) {
            return redirect()->route('home')->with('error', 'Veuillez sélectionner une méthode de paiement');
        }

        $produit->load([
            'typeProduit',
            'contactSocialMedia',
            'produitPrices' => function($q) use ($paymentMethodId) {
                $q->where('id_price_methode', $paymentMethodId)->with('priceMethode');
            }
        ]);

        // Vérifier que le produit a un prix pour cette méthode
        if ($produit->produitPrices->isEmpty()) {
            return redirect()->route('client.catalog', ['payment_method_id' => $paymentMethodId])
                           ->with('error', 'Ce produit n\'est pas disponible pour cette méthode de paiement');
        }

        return Inertia::render('Client/ProductDetail', [
            'produit' => $produit,
            'paymentMethodId' => $paymentMethodId,
        ]);
    }
}
