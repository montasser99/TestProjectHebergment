<?php

use App\Http\Controllers\Admin\CommandeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PriceMethodeController;
use App\Http\Controllers\Admin\ProduitController;
use App\Http\Controllers\Admin\TypeProduitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Client\CartController;
use App\Http\Controllers\Client\ClientController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'selectedPaymentMethod' => request('payment_method_id') ? \App\Models\PriceMethode::find(request('payment_method_id')) : null,
    ]);
});

Route::get('/unauthorized', function () {
    return Inertia::render('Errors/Unauthorized');
})->name('unauthorized');

// Route de debug pour le stockage (à supprimer en production)
Route::get('/debug/storage', function () {
    if (config('app.env') !== 'production') {
        return response()->json(['error' => 'Debug route only available in production for Railway testing']);
    }
    
    $info = [
        'public_storage_exists' => file_exists(public_path('storage')),
        'public_storage_is_link' => is_link(public_path('storage')),
        'storage_app_public_exists' => file_exists(storage_path('app/public')),
        'produits_folder_exists' => file_exists(storage_path('app/public/produits')),
        'commandes_folder_exists' => file_exists(storage_path('app/public/commandes')),
        'storage_link_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : null,
        'produits_files' => file_exists(storage_path('app/public/produits')) ? scandir(storage_path('app/public/produits')) : [],
        'app_url' => config('app.url'),
        'asset_url' => config('app.asset_url'),
    ];
    
    return response()->json($info);
})->name('debug.storage');

// Route pour servir les images de stockage sur Railway
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    $mimeType = mime_content_type($filePath);
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*')->name('storage.serve');

Route::get('/dashboard', function () {
    // Rediriger les clients vers la page d'accueil Welcome
    if (auth()->user()->role === 'client') {
        return redirect('/');
    }
    
    // Rediriger les admins et gestionnaires de commandes vers le dashboard admin
    if (auth()->user()->role === 'admin' || auth()->user()->role === 'gestionnaire_commande') {
        return redirect()->route('admin.dashboard');
    }
    
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route pour rediriger les clients vers la page d'accueil
Route::get('/client', function () {
    return redirect('/');
})->middleware(['auth'])->name('client.home');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// ================================
// ROUTES ADMIN - Gestion des utilisateurs
// ================================
Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Gestion des utilisateurs - CRUD manuel selon cahier des charges
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/block', [UserController::class, 'block'])->name('users.block');
    Route::patch('/users/{user}/unblock', [UserController::class, 'unblock'])->name('users.unblock');

    // Gestion des types de produits
    Route::get('/type-produits', [TypeProduitController::class, 'index'])->name('type-produits.index');
    Route::get('/type-produits/create', [TypeProduitController::class, 'create'])->name('type-produits.create');
    Route::post('/type-produits', [TypeProduitController::class, 'store'])->name('type-produits.store');
    Route::get('/type-produits/{typeProduit}/edit', [TypeProduitController::class, 'edit'])->name('type-produits.edit');
    Route::put('/type-produits/{typeProduit}', [TypeProduitController::class, 'update'])->name('type-produits.update');
    Route::delete('/type-produits/{typeProduit}', [TypeProduitController::class, 'destroy'])->name('type-produits.destroy');

 // Gestion des méthodes de prix
    Route::get('/price-methodes', [PriceMethodeController::class, 'index'])->name('price-methodes.index');
    Route::get('/price-methodes/create', [PriceMethodeController::class, 'create'])->name('price-methodes.create');
    Route::post('/price-methodes', [PriceMethodeController::class, 'store'])->name('price-methodes.store');
    Route::get('/price-methodes/{priceMethode}/edit', [PriceMethodeController::class, 'edit'])->name('price-methodes.edit');
    Route::put('/price-methodes/{priceMethode}', [PriceMethodeController::class, 'update'])->name('price-methodes.update');
    Route::delete('/price-methodes/{priceMethode}', [PriceMethodeController::class, 'destroy'])->name('price-methodes.destroy');

  // Gestion des produits
    Route::get('/produits', [ProduitController::class, 'index'])->name('produits.index');
    Route::get('/produits/create', [ProduitController::class, 'create'])->name('produits.create');
    Route::post('/produits', [ProduitController::class, 'store'])->name('produits.store');
    Route::get('/produits/{produit}', [ProduitController::class, 'show'])->name('produits.show');
    Route::get('/produits/{produit}/edit', [ProduitController::class, 'edit'])->name('produits.edit');
    Route::put('/produits/{produit}', [ProduitController::class, 'update'])->name('produits.update');
    Route::delete('/produits/{produit}', [ProduitController::class, 'destroy'])->name('produits.destroy');

});

// ================================
// ROUTES COMMANDES - Accessible aux admins ET gestionnaires de commandes
// ================================
Route::middleware(['order.manager'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard (accessible aussi aux gestionnaires de commandes)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Gestion des commandes
    Route::get('/commandes', [CommandeController::class, 'index'])->name('commandes.index');
    Route::get('/commandes/{commande}', [CommandeController::class, 'show'])->name('commandes.show');
    Route::post('/commandes/{commande}/confirm', [CommandeController::class, 'confirm'])->name('commandes.confirm');
    Route::post('/commandes/{commande}/cancel', [CommandeController::class, 'cancel'])->name('commandes.cancel');
    Route::put('/commandes/{commande}/notes', [CommandeController::class, 'updateNotes'])->name('commandes.update-notes');
});

// Routes client authentifiées
Route::middleware(['auth'])->group(function () {
    
    // Sélection de méthode de paiement (première étape obligatoire)
    Route::get('/client/payment-method', [ClientController::class, 'selectPaymentMethod'])->name('client.payment-method');
    
    // Catalogue et produits (avec méthode de paiement sélectionnée)
    Route::get('/client/products', [ClientController::class, 'catalog'])->name('client.catalog');
    Route::get('/client/product/{produit}', [ClientController::class, 'productDetail'])->name('client.product.show');
    
    // Panier
    Route::get('/cart', [CartController::class, 'index'])->name('client.cart');
    Route::post('/api/cart/product-info', [CartController::class, 'getProductInfo'])->name('api.cart.product-info');
    Route::post('/api/cart/validate-product', [CartController::class, 'validateProductForCart'])->name('api.cart.validate-product');
    
    // Commandes - CORRECTION: Utiliser Client\CommandeController
    Route::get('/checkout', [\App\Http\Controllers\Client\CommandeController::class, 'checkout'])->name('client.checkout');
    Route::post('/orders', [\App\Http\Controllers\Client\CommandeController::class, 'store'])->name('client.orders.store');
    Route::get('/orders/{commande}/success', [\App\Http\Controllers\Client\CommandeController::class, 'success'])->name('client.orders.success');
    Route::get('/orders/history', [\App\Http\Controllers\Client\CommandeController::class, 'history'])->name('client.orders.history');
});





require __DIR__.'/auth.php';
