<?php
// App/Http/Controllers/Client/HomeController.php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\TypeProduit;
use App\Models\PriceMethode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Page d'accueil - Sélection méthode de paiement
     */
    public function index()
    {
        $priceMethodes = PriceMethode::orderBy('methode_name')->get();
        
        return Inertia::render('Client/PaymentMethodSelection', [
            'priceMethodes' => $priceMethodes,
        ]);
    }

    /**
     * Catalogue des produits
     */
    public function catalog(Request $request)
    {
        // Récupérer la méthode de paiement depuis la requête ou localStorage
        $paymentMethodId = $request->input('payment_method_id');
        
        if (!$paymentMethodId) {
            return redirect()->route('home')->with('error', 'Veuillez d\'abord sélectionner une méthode de paiement');
        }

        $query = Produit::with(['typeProduit', 'contactSocialMedia'])
                        ->whereHas('produitPrices', function($q) use ($paymentMethodId) {
                            $q->where('id_price_methode', $paymentMethodId);
                        });

        // Filtrage par type de produit (sélection multiple)
        if ($request->filled('types')) {
            $types = explode(',', $request->types);
            $query->whereIn('type_produit_id', $types);
        }

        // Filtrage par prix (selon la méthode choisie)
        if ($request->filled('min_price') || $request->filled('max_price')) {
            $query->whereHas('produitPrices', function($q) use ($paymentMethodId, $request) {
                $q->where('id_price_methode', $paymentMethodId);
                if ($request->filled('min_price')) {
                    $q->where('price', '>=', $request->min_price);
                }
                if ($request->filled('max_price')) {
                    $q->where('price', '<=', $request->max_price);
                }
            });
        }

        // Recherche par nom
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('label', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $produits = $query->with(['produitPrices' => function($q) use ($paymentMethodId) {
                                $q->where('id_price_methode', $paymentMethodId)
                                  ->with('priceMethode');
                            }])
                            ->paginate(12)
                            ->withQueryString();

        // Récupérer les types de produits pour les filtres
        $typeProduits = TypeProduit::withCount(['produits' => function($q) use ($paymentMethodId) {
            $q->whereHas('produitPrices', function($subQ) use ($paymentMethodId) {
                $subQ->where('id_price_methode', $paymentMethodId);
            });
        }])->having('produits_count', '>', 0)->get();

        // Récupérer la fourchette de prix pour la méthode sélectionnée
        $priceRange = DB::table('produit_prices')
                        ->where('id_price_methode', $paymentMethodId)
                        ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
                        ->first();

        $selectedPaymentMethod = PriceMethode::find($paymentMethodId);

        return Inertia::render('Client/Catalog', [
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'priceRange' => $priceRange,
            'selectedPaymentMethod' => $selectedPaymentMethod,
            'filters' => $request->only(['types', 'min_price', 'max_price', 'search']),
        ]);
    }
}