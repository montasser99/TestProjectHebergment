# Rôle Gestionnaire de Commandes

## Objectif

Le rôle `gestionnaire_commande` a été créé pour permettre à des utilisateurs spécialisés de gérer uniquement les commandes sans avoir accès à toutes les fonctionnalités d'administration.

## Fonctionnalités accessibles

### ✅ **Accès autorisé :**
- **Dashboard admin** - Vue d'ensemble des statistiques
- **Gestion des commandes** - Consultation, confirmation, annulation, notes

### ❌ **Accès restreint :**
- Gestion des utilisateurs
- Gestion des types de produits  
- Gestion des méthodes de paiement
- Gestion des produits

## Structure technique

### 1. **Migration de base de données**
```sql
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'client', 'gestionnaire_commande') DEFAULT 'client'
```

### 2. **Modèle User - Nouvelles méthodes**
```php
public function isOrderManager()
{
    return $this->role === 'gestionnaire_commande';
}

public function canManageOrders()
{
    return $this->role === 'admin' || $this->role === 'gestionnaire_commande';
}
```

### 3. **Middleware OrderManagerMiddleware**
- Autorise l'accès aux utilisateurs `admin` ET `gestionnaire_commande`
- Utilisé pour protéger les routes de commandes

### 4. **Navigation dynamique**
Le layout admin adapte automatiquement la navigation selon le rôle :
- **Admin** : Voit tous les menus
- **Gestionnaire de commandes** : Voit uniquement Dashboard + Commandes

### 5. **Routes sécurisées**
```php
// Accessible aux deux rôles
Route::middleware(['order.manager'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/commandes', [CommandeController::class, 'index']);
    // ... autres routes commandes
});

// Uniquement admin
Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    // ... autres routes admin
});
```

## Création d'un gestionnaire de commandes

### Via l'interface admin :
1. **Se connecter en tant qu'admin**
2. **Aller dans "Gestion des utilisateurs"**
3. **Créer ou modifier un utilisateur**
4. **Sélectionner le rôle "Gestionnaire de commandes"**

### Caractéristiques visuelles :
- **Badge bleu** dans la liste des utilisateurs
- **Navigation limitée** dans l'interface admin
- **Accès sécurisé** par middleware

## Redirections automatiques

Les gestionnaires de commandes sont automatiquement redirigés vers le dashboard admin lors de la connexion, tout comme les admins.

## Sécurité

- **Middleware dédié** : Protection au niveau des routes
- **Validation backend** : Impossible de contourner via l'interface
- **Navigation contextuelle** : Interface adaptée au rôle

---

**✅ Le rôle gestionnaire de commandes est maintenant opérationnel !**