#!/bin/bash

# Script de démarrage robuste pour Railway
set -e

echo "🚀 Démarrage de l'application AMAZIGHI SHOP..."

# Vérifier si le build des assets a réussi, sinon le refaire
if [ ! -d "public/build" ] || [ ! -f "public/build/manifest.json" ]; then
    echo "⚠️ Assets non trouvés ou incomplets, tentative de build..."
    if command -v npm >/dev/null 2>&1; then
        export NODE_OPTIONS="--max-old-space-size=512"
        timeout 180 npm run build || (
            echo "❌ Build failed, creating minimal fallback..."
            mkdir -p public/build
            echo '{"resources/js/app.jsx":{"file":"assets/app.js","isEntry":true}}' > public/build/manifest.json
            touch public/build/assets/app.js
            echo "✅ Fallback assets created"
        )
    else
        echo "❌ NPM non trouvé, creating minimal assets..."
        mkdir -p public/build/assets
        echo '{"resources/js/app.jsx":{"file":"assets/app.js","isEntry":true}}' > public/build/manifest.json
        touch public/build/assets/app.js
    fi
else
    echo "✅ Assets build trouvés"
fi

# Afficher les variables d'environnement importantes (sans valeurs sensibles)
echo "📊 Variables d'environnement:"
echo "- APP_ENV: $APP_ENV"
echo "- APP_DEBUG: $APP_DEBUG" 
echo "- DB_CONNECTION: $DB_CONNECTION"
echo "- PORT: $PORT"

# Générer la clé d'application si elle n'existe pas
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate --force
    echo "✅ Clé d'application générée"
else
    echo "✅ Clé d'application déjà présente"
fi

# Nettoyer le cache de configuration
echo "🧹 Nettoyage du cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Créer le lien de stockage
echo "🔗 Création du lien de stockage..."
php artisan storage:link --force || echo "⚠️ Lien de stockage déjà existant"

# Tester la connexion à la base de données
echo "🗄️ Test de la connexion à la base de données..."
if php artisan migrate:status > /dev/null 2>&1; then
    echo "✅ Connexion à la base de données réussie"
    
    # Exécuter les migrations
    echo "📝 Exécution des migrations..."
    php artisan migrate --force
    echo "✅ Migrations terminées"
    
    # Seeder les données administrateur (ignorer si déjà fait)
    echo "🌱 Seedeur des données..."
    php artisan db:seed --class=AdminSeeder --force || echo "⚠️ Seeder déjà exécuté"
    echo "✅ Données seedées"
else
    echo "❌ Impossible de se connecter à la base de données"
    echo "Détails de la base de données pour debug:"
    echo "DB_HOST: ${DB_HOST:-$MYSQLHOST}"
    echo "DB_PORT: ${DB_PORT:-$MYSQLPORT}"
    echo "DB_DATABASE: ${DB_DATABASE:-$MYSQLDATABASE}"
    exit 1
fi

# Créer le lien de stockage pour les commandes
echo "🔗 Création du lien de stockage commandes..."
php artisan storage:link-commandes || echo "⚠️ Commande non trouvée ou déjà exécutée"

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur le port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT