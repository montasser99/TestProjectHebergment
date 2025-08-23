<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TypeProduit;
use App\Models\PriceMethode;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\ProduitPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userRole = Auth::user()->role;
        
        if ($userRole === 'gestionnaire_commande') {
            // Statistiques simplifiées pour gestionnaire de commande
            $stats = $this->getOrderManagerStats();
        } else {
            // Statistiques complètes pour administrateur
            $stats = $this->getAdminStats();
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'userRole' => $userRole
        ]);
    }
    
    private function getOrderManagerStats()
    {
        return [
            'total_orders' => Commande::count(),
            'pending_orders' => Commande::where('statut', 'en_attente')->count(),
            'confirmed_orders' => Commande::where('statut', 'confirme')->count(),
            'cancelled_orders' => Commande::where('statut', 'annuler')->count(),
        ];
    }
    
    private function getAdminStats()
    {
        // Statistiques des utilisateurs
        $total_users = User::count();
        $active_users = User::where('is_blocked', false)->count();
        $blocked_users = User::where('is_blocked', true)->count();
        
        // Statistiques des types de produits avec nombre de produits
        $type_produits = TypeProduit::withCount('produits')->get();
        $total_type_produits = $type_produits->count();
        
        // Statistiques des méthodes de paiement avec nombre de produits
        $payment_methods = PriceMethode::with('produitPrices.produit')
            ->get()
            ->map(function($method) {
                return [
                    'id' => $method->id,
                    'methode_name' => $method->methode_name,
                    'products_count' => $method->produitPrices->unique('id_produit')->count()
                ];
            });
        $total_payment_methods = $payment_methods->count();
        
        // Statistiques des produits
        $total_products = Produit::count();
        
        // Statistiques des commandes
        $total_orders = Commande::count();
        $pending_orders = Commande::where('statut', 'en_attente')->count();
        $confirmed_orders = Commande::where('statut', 'confirme')->count();
        $cancelled_orders = Commande::where('statut', 'annuler')->count();
        
        // Chart des prix des produits (prix le plus haut au plus bas)
        $product_prices_chart = DB::table('produit_prices')
            ->join('produits', 'produit_prices.id_produit', '=', 'produits.id')
            ->select('produits.label as product_name', DB::raw('MAX(produit_prices.price) as max_price'))
            ->groupBy('produits.id', 'produits.label')
            ->orderBy('max_price', 'desc')
            ->limit(10)
            ->get();
        
        // Chart des commandes par utilisateur
        $orders_by_user_chart = DB::table('commandes')
            ->join('users', 'commandes.user_id', '=', 'users.id')
            ->select('users.name as user_name', DB::raw('COUNT(commandes.id) as orders_count'))
            ->groupBy('users.id', 'users.name')
            ->orderBy('orders_count', 'desc')
            ->limit(10)
            ->get();
        
        return [
            // Statistiques utilisateurs
            'total_users' => $total_users,
            'active_users' => $active_users,
            'blocked_users' => $blocked_users,
            
            // Statistiques types de produits
            'total_type_produits' => $total_type_produits,
            'type_produits_details' => $type_produits,
            
            // Statistiques méthodes de paiement
            'total_payment_methods' => $total_payment_methods,
            'payment_methods_details' => $payment_methods,
            
            // Statistiques produits
            'total_products' => $total_products,
            
            // Statistiques commandes
            'total_orders' => $total_orders,
            'pending_orders' => $pending_orders,
            'confirmed_orders' => $confirmed_orders,
            'cancelled_orders' => $cancelled_orders,
            
            // Charts
            'product_prices_chart' => $product_prices_chart,
            'orders_by_user_chart' => $orders_by_user_chart,
        ];
    }
}
