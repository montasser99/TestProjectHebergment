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
echo "- MYSQLHOST: $MYSQLHOST"
echo "- MYSQLDATABASE: $MYSQLDATABASE"

# Créer un fichier .env minimal si il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env 2>/dev/null || echo "APP_KEY=" > .env
    
    # Configurer les variables Railway si elles existent
    if [ -n "$MYSQLHOST" ]; then
        echo "🔧 Configuration des variables Railway MySQL..."
        sed -i "s/DB_HOST=.*/DB_HOST=$MYSQLHOST/" .env
        sed -i "s/DB_PORT=.*/DB_PORT=${MYSQLPORT:-3306}/" .env
        sed -i "s/DB_DATABASE=.*/DB_DATABASE=$MYSQLDATABASE/" .env
        sed -i "s/DB_USERNAME=.*/DB_USERNAME=$MYSQLUSER/" .env
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQLPASSWORD/" .env
        
        echo "📋 Configuration de la base de données:"
        echo "- DB_HOST=$MYSQLHOST"
        echo "- DB_PORT=${MYSQLPORT:-3306}"
        echo "- DB_DATABASE=$MYSQLDATABASE"
        echo "- DB_USERNAME=$MYSQLUSER"
    fi
    
    # Configurer l'URL de l'application
    if [ -n "$RAILWAY_STATIC_URL" ]; then
        sed -i 's|APP_URL=.*|APP_URL=https://'"$RAILWAY_STATIC_URL"'|' .env
        sed -i 's|ASSET_URL=.*|ASSET_URL=https://'"$RAILWAY_STATIC_URL"'|' .env
        sed -i 's|APP_FORCE_HTTPS=.*|APP_FORCE_HTTPS=true|' .env
    fi
fi

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
if [ -n "$MYSQLHOST" ]; then
    echo "✅ Variables MySQL Railway détectées"
    
    # Attendre quelques secondes pour que MySQL soit prêt
    echo "⏱️ Attente de la disponibilité de MySQL..."
    sleep 5
    
    # Essayer la connexion plusieurs fois
    RETRY_COUNT=0
    MAX_RETRIES=3
    
    # Test direct de connexion d'abord
    echo "🔍 Test de connexion directe..."
    if php artisan tinker --execute="DB::connection()->getPdo(); echo 'Connexion OK';" 2>/dev/null; then
        echo "✅ Connexion à la base de données réussie"
        
        # Créer la table migrations si elle n'existe pas
        echo "📝 Initialisation des migrations..."
        php artisan migrate:install --force 2>/dev/null || echo "Table migrations déjà existante"
        
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
        echo "📋 Configuration actuelle:"
        php artisan config:show database.connections.mysql || echo "Erreur lors de l'affichage de la config"
    fi
else
    echo "⚠️ Variables MySQL Railway non trouvées - démarrage sans base de données"
    echo "👉 Veuillez ajouter un service MySQL à votre projet Railway"
fi

# Créer le lien de stockage pour les commandes
echo "🔗 Création du lien de stockage commandes..."
php artisan storage:link-commandes || echo "⚠️ Commande non trouvée ou déjà exécutée"

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur le port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT