# Sécurisation Backend - Méthodes de Paiement

## Objectif de la sécurisation

Empêcher qu'un utilisateur malveillant contourne les restrictions frontend (boutons désactivés, messages d'erreur) en modifiant le code JavaScript via l'inspecteur du navigateur pour forcer l'ajout de produits sans prix au panier ou créer des commandes invalides.

## Mesures de sécurité implémentées

### 1. **CartController** - Validation des produits pour le panier

#### Méthode `getProductInfo()` - Lignes 26-93
**Sécurisations :**
- ✅ Validation stricte des IDs (integer + exists)
- ✅ Vérification de l'existence de la méthode de paiement
- ✅ **CRITIQUE** : Vérification que le produit a un prix pour cette méthode
- ✅ Validation que le prix > 0
- ✅ Messages d'erreur avec codes d'erreur spécifiques
- ✅ Retour JSON structuré avec informations de validation

#### Nouvelle méthode `validateProductForCart()` - Lignes 99-174
**Sécurisations avancées :**
- ✅ Validation des quantités (min: 1, max: 999)
- ✅ Double vérification produit + méthode de paiement + prix
- ✅ Calcul du sous-total validé côté serveur
- ✅ Gestion d'exceptions avec try/catch
- ✅ **Route API** : `/api/cart/validate-product` (POST)

### 2. **CommandeController** - Validation lors de la création de commande

#### Méthode `store()` - Lignes 127-227
**Sécurisations renforcées :**
- ✅ Validation renforcée des IDs et quantités
- ✅ Vérification de l'existence de la méthode de paiement
- ✅ **CRITIQUE** : Pour chaque produit du panier :
  - Vérification que le produit existe
  - **Validation obligatoire** : Produit DOIT avoir un prix pour cette méthode
  - Validation que le prix > 0
  - Messages d'erreur explicites avec noms des produits/méthodes
- ✅ Validation du montant total > 0
- ✅ Transaction base de données (rollback en cas d'erreur)
- ✅ Gestion d'exceptions détaillée

## Messages d'erreur personnalisés

### Exemples de messages retournés :
```php
// Si pas de prix pour une méthode
"Le produit 'iPhone 13' n'a pas de prix configuré pour la méthode de paiement 'D17'. Veuillez choisir une autre méthode de paiement."

// Si prix invalide
"Prix invalide pour le produit 'Samsung Galaxy'"

// Si quantité invalide
"Quantité invalide pour le produit n°1. Quantité demandée: -5"
```

## Scénarios d'attaque bloqués

### ❌ **Scénario 1** : Activer un bouton désactivé via l'inspecteur
- **Frontend** : Bouton désactivé pour produit sans prix
- **Attaque** : User supprime `disabled` via inspecteur → clique sur le bouton
- **Protection** : Validation backend dans `CommandeController::store()` rejette la commande

### ❌ **Scénario 2** : Manipuler les données du panier localStorage
- **Attaque** : Modifier le localStorage pour ajouter des produits sans prix
- **Protection** : Chaque produit re-vérifié côté serveur avant création commande

### ❌ **Scénario 3** : Appel direct aux APIs avec données falsifiées
- **Attaque** : POST direct vers `/orders` avec product_id sans prix
- **Protection** : Validation complète dans le contrôleur + transaction rollback

## Tests de validation

### Test manuel à effectuer :
1. **Ajouter un produit sans prix** (via localStorage manipulé)
2. **Essayer de finaliser la commande**
3. **Vérifier** : Erreur bloquante avec message explicite
4. **Confirmer** : Aucune commande créée en base

### Commande de test API :
```bash
curl -X POST /api/cart/validate-product \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"payment_method_id":999,"quantity":1}'
# Doit retourner : error "Méthode de paiement invalide"
```

## Logs de sécurité

Les validations échouées sont automatiquement loggées par Laravel dans :
- `storage/logs/laravel.log`
- Inclut : tentative d'ajout, user ID, timestamp, détails de l'erreur

---

**✅ RÉSULTAT** : L'application est maintenant sécurisée côté backend contre les manipulations malveillantes du frontend.