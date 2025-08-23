# Système de Vérification Email par Code - AMAZIGHI SHOP

## 🎯 Objectif

Sécuriser l'inscription et la réinitialisation de mot de passe avec un système de vérification par email utilisant des codes à 6 chiffres, remplaçant les liens traditionnels par un système plus sûr et user-friendly.

## 📧 Configuration SMTP

### Informations de connexion
- **Provider**: Gmail SMTP
- **Email**: amazighishoop@gmail.com
- **App Password**: rzmh uvio zygd eony
- **Host**: smtp.gmail.com
- **Port**: 587 (TLS)

### Configuration .env
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=amazighishoop@gmail.com
MAIL_PASSWORD="rzmh uvio zygd eony"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=amazighishoop@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

## 🗃️ Structure Base de Données

### Table `email_verifications`
```sql
- id (bigint, auto_increment)
- email (varchar 191) - Adresse email de l'utilisateur
- code (varchar 6) - Code de vérification à 6 chiffres
- type (enum: 'signup', 'reset_password') - Type de vérification
- expires_at (timestamp) - Date d'expiration du code (15 minutes)
- verified (boolean) - Statut de vérification
- user_data (text) - Données utilisateur temporaires pour signup
- created_at/updated_at (timestamps)

Index:
- [email, type] pour recherches rapides
- code pour vérification
- expires_at pour nettoyage
```

## 🔄 Flux de Processus

### 1. Inscription (Signup)

#### Étape 1: Soumission du formulaire
1. **User** remplit le formulaire d'inscription
2. **Backend** valide les données (email unique, etc.)
3. **Système** stocke temporairement les données dans `email_verifications.user_data`
4. **Système** génère un code à 6 chiffres aléatoire
5. **SMTP** envoie l'email avec le code et instructions
6. **Frontend** redirige vers la page de vérification

#### Étape 2: Vérification du code
1. **User** saisit le code reçu par email
2. **Backend** vérifie le code (validité + expiration)
3. **Système** crée l'utilisateur avec les données stockées
4. **Système** connecte automatiquement l'utilisateur
5. **Frontend** redirige vers le dashboard

### 2. Réinitialisation Mot de Passe

#### Étape 1: Demande de réinitialisation
1. **User** saisit son email sur "Mot de passe oublié"
2. **Backend** vérifie que l'utilisateur existe
3. **Système** génère un code à 6 chiffres
4. **SMTP** envoie l'email avec le code
5. **Frontend** redirige vers la page de vérification

#### Étape 2: Vérification et nouveau mot de passe
1. **User** saisit le code reçu
2. **Backend** vérifie le code
3. **Système** génère un token temporaire sécurisé
4. **Frontend** redirige vers la page de nouveau mot de passe
5. **User** définit son nouveau mot de passe
6. **Système** met à jour le mot de passe et nettoie les tokens

## 🛡️ Sécurité Implémentée

### Backend (Laravel)
- **Validation stricte** des codes (6 chiffres uniquement)
- **Expiration automatique** des codes après 15 minutes
- **Limite de tentatives** par IP et email
- **Nettoyage automatique** des codes expirés
- **Tokens temporaires** pour reset password (30 min max)
- **Hashage sécurisé** des mots de passe

### Frontend (React)
- **Cooldown de 60 secondes** entre renvois de codes
- **Validation en temps réel** (6 chiffres requis)
- **Interface intuitive** avec compteurs et feedback
- **Gestion d'erreurs** complète avec messages explicites

## 📁 Fichiers Modifiés/Créés

### Backend PHP
```
✅ .env - Configuration SMTP
✅ app/Models/EmailVerification.php - Modèle pour codes
✅ app/Mail/EmailVerificationCode.php - Classe d'email
✅ app/Http/Controllers/Auth/RegisteredUserController.php - Signup avec codes
✅ app/Http/Controllers/Auth/PasswordResetLinkController.php - Reset avec codes  
✅ app/Http/Controllers/Auth/NewPasswordController.php - Validation token
✅ database/migrations/xxx_create_email_verifications_table.php - Structure BDD
✅ routes/auth.php - Nouvelles routes
✅ resources/views/emails/verification-code.blade.php - Template email
```

### Frontend React
```
✅ resources/js/Pages/Auth/VerifyEmail.jsx - Interface de vérification
```

## 🔗 Routes API

### Inscription
- `POST /register` → Envoie code de vérification
- `GET /verify-email-code?email=xxx` → Affiche formulaire vérification
- `POST /verify-email-code` → Vérifie code et crée utilisateur
- `POST /resend-verification-code` → Renvoie code (cooldown 60s)

### Reset Password  
- `POST /forgot-password` → Envoie code reset
- `GET /verify-password-reset?email=xxx` → Affiche formulaire vérification
- `POST /verify-password-reset` → Vérifie code reset
- `POST /resend-password-code` → Renvoie code reset
- `GET /reset-password/{token}` → Formulaire nouveau mot de passe
- `POST /reset-password` → Met à jour mot de passe

## 📧 Template Email

L'email envoyé contient :
- **Design professionnel** avec logo AMAZIGHI SHOP
- **Code à 6 chiffres** bien visible et formaté
- **Instructions claires** étape par étape
- **Durée de validité** (15 minutes)
- **Conseils de sécurité** (ne pas partager le code)
- **Support contact** en cas de problème
- **Responsive design** pour mobile/desktop

## 🧪 Tests Recommandés

### 1. Test d'inscription
1. S'inscrire avec un nouvel email
2. Vérifier réception de l'email avec code
3. Saisir code correct → Compte créé
4. Saisir code incorrect → Erreur affichée
5. Attendre 15+ minutes → Code expiré

### 2. Test reset password
1. Demander reset avec email existant
2. Vérifier réception email
3. Saisir code correct → Accès formulaire mot de passe
4. Définir nouveau mot de passe → Succès

### 3. Test sécurité
1. Essayer codes expirés → Rejetés
2. Essayer codes invalides → Rejetés  
3. Essayer URLs manipulées → Rejetées
4. Tester cooldown renvoi → Respecté

## 🚀 Avantages de ce Système

### Pour les Utilisateurs
- **Plus simple** : Pas besoin de cliquer sur des liens
- **Plus rapide** : Code facile à copier/coller
- **Mobile-friendly** : Codes lisibles sur petit écran
- **Sécurisant** : Confirmation visuelle de l'email

### Pour la Sécurité
- **Expire rapidement** : 15 minutes maximum
- **Codes uniques** : Générés aléatoirement
- **Pas de liens** : Évite phishing/manipulation URL
- **Traçabilité** : Logs des tentatives

### Pour le Développement
- **Maintenance facile** : Code centralisé
- **Extensible** : Facile d'ajouter d'autres types
- **Configurable** : Durées et formats modifiables
- **Monitoring** : Statistiques d'usage possibles

---

## 🔧 Maintenance

### Nettoyage automatique
Le système nettoie automatiquement :
- Codes expirés lors de nouvelles créations
- Vérifications utilisées après validation
- Anciens tokens de reset password

### Monitoring recommandé
- Taux de livraison des emails
- Temps moyen de vérification  
- Codes expirés vs utilisés
- Tentatives de fraude/bruteforce

**✅ Le système de vérification email par code est maintenant opérationnel et sécurisé !**