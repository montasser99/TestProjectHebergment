# AMAZIGHI SHOP - Configuration Railway

## 🚀 Variables d'environnement requises

### Variables automatiques (fournies par Railway)
- `MYSQLHOST` - Host de la base MySQL
- `MYSQLPORT` - Port de la base MySQL  
- `MYSQLDATABASE` - Nom de la base
- `MYSQLUSER` - Utilisateur MySQL
- `MYSQLPASSWORD` - Mot de passe MySQL
- `RAILWAY_STATIC_URL` - URL de votre app
- `PORT` - Port d'écoute

### Variables à configurer manuellement
- `APP_KEY` - Généré automatiquement au démarrage
- `APP_DEBUG=false` - Mode production
- `APP_ENV=production` - Environnement production

## 🔧 Services requis

1. **Base de données MySQL** - Ajouter le service MySQL à votre projet Railway
2. **Application Web** - Déployer ce repository

## 📋 Processus de déploiement

1. Connecter ce repository à Railway
2. Ajouter le service MySQL 
3. Les variables d'environnement seront automatiquement configurées
4. Le déploiement se fera automatiquement

## 👤 Compte administrateur par défaut

- **Email:** admin@amazighi.tn
- **Mot de passe:** admin123

⚠️ **Important:** Changez ces identifiants après la première connexion !

## 🔍 Debugging

- **Healthcheck:** `https://votre-app.railway.app/healthcheck.php`
- **Logs:** Consultez les logs Railway pour diagnostiquer les problèmes
- **Base de données:** Vérifiez que le service MySQL est bien connecté

## 📂 Stockage

L'application crée automatiquement :
- `storage/app/public/produits` - Images des produits
- `storage/app/public/commandes` - Images des commandes (copies)
- Liens symboliques vers `public/storage/*`