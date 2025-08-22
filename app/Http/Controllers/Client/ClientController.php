<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\PriceMethode;
use App\Models\Produit;
use App\Models\TypeProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Afficher la page de sélection de méthode de paiement
     * Affiche seulement les méthodes disponibles pour TOUS les produits
     */
    public function selectPaymentMethod()
    {
        // Compter le nombre total de produits
        $totalProducts = Produit::count();
        
        if ($totalProducts === 0) {
            // Si aucun produit, retourner toutes les méthodes
            $priceMethodes = PriceMethode::orderBy('methode_name')->get();
        } else {
            // Récupérer uniquement les méthodes de paiement disponibles pour TOUS les produits
            $priceMethodes = PriceMethode::whereIn('id', function($subquery) use ($totalProducts) {
                $subquery->select('id_price_methode')
                        ->from('produit_prices')
                        ->groupBy('id_price_methode')
                        ->havingRaw('COUNT(DISTINCT id_produit) = ?', [$totalProducts]);
            })
            ->withCount(['produitPrices as products_count' => function($query) {
                $query->select(DB::raw('COUNT(DISTINCT id_produit)'));
            }])
            ->orderBy('methode_name')
            ->get();
        }
        
        return Inertia::render('Client/PaymentMethodSelection', [
            'priceMethodes' => $priceMethodes,
            'totalProducts' => $totalProducts
        ]);
    }

    /**
     * Afficher le catalogue de produits selon la méthode de paiement sélectionnée
     */
    public function catalog(Request $request)
    {
        $paymentMethodId = $request->payment_method_id;
        
        if (!$paymentMethodId) {
            return redirect()->route('client.payment-method');
        }

        // Récupérer la méthode de paiement sélectionnée
        $selectedPaymentMethod = PriceMethode::findOrFail($paymentMethodId);
        
        // Récupérer les produits avec les prix pour cette méthode de paiement
        $query = Produit::with([
            'typeProduit',
            'contactSocialMedia',
            'produitPrices' => function($q) use ($paymentMethodId) {
                $q->where('id_price_methode', $paymentMethodId);
            }
        ]);

        // Filtrage par type de produit (support multiple)
        if ($request->filled('type_produit_id')) {
            $query->where('type_produit_id', $request->type_produit_id);
        } elseif ($request->filled('types')) {
            $types = explode(',', $request->types);
            $query->whereIn('type_produit_id', $types);
        }

        // Filtrage par prix (selon la méthode de paiement sélectionnée)
        if ($request->filled('min_price') || $request->filled('max_price')) {
            $query->whereHas('produitPrices', function($q) use ($request, $paymentMethodId) {
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

        $produits = $query->paginate(8)->withQueryString();

        // Récupérer les types de produits avec comptage
        $typeProduits = TypeProduit::withCount(['produits' => function($query) use ($paymentMethodId) {
            $query->whereHas('produitPrices', function($q) use ($paymentMethodId) {
                $q->where('id_price_methode', $paymentMethodId);
            });
        }])->orderBy('name')->get();
        
        // Calculer les prix min/max pour cette méthode de paiement
        $priceRange = DB::table('produit_prices')
            ->where('id_price_methode', $paymentMethodId)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return Inertia::render('Client/Catalog', [
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'selectedPaymentMethod' => $selectedPaymentMethod,
            'priceRange' => $priceRange,
            'filters' => $request->only(['search', 'type_produit_id', 'types', 'min_price', 'max_price'])
        ]);
    }

    /**
     * Afficher les détails d'un produit
     */
    public function productDetail(Request $request, Produit $produit)
    {
        // Récupérer la méthode de paiement depuis l'URL ou utiliser la première disponible
        $paymentMethodId = $request->payment_method_id;
        
        // Si pas de méthode de paiement spécifiée, utiliser la première disponible
        if (!$paymentMethodId) {
            $firstMethod = PriceMethode::first();
            $paymentMethodId = $firstMethod ? $firstMethod->id : null;
        }

        $produit->load([
            'typeProduit',
            'contactSocialMedia',
            'produitPrices' => function($q) use ($paymentMethodId) {
                if ($paymentMethodId) {
                    $q->where('id_price_methode', $paymentMethodId)
                      ->with('priceMethode');
                } else {
                    $q->with('priceMethode');
                }
            }
        ]);

        $selectedPaymentMethod = $paymentMethodId ? PriceMethode::find($paymentMethodId) : null;

        return Inertia::render('Client/ProductDetail', [
            'produit' => $produit,
            'selectedPaymentMethod' => $selectedPaymentMethod,
            'paymentMethodId' => $paymentMethodId,
        ]);
    }
}
