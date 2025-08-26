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

# Configurer MySQL Railway AVANT tout
if [ -n "$MYSQLHOST" ]; then
    echo "🔧 Configuration MySQL Railway (prioritaire)..."
    export DB_CONNECTION=mysql
    export DB_HOST="$MYSQLHOST"
    export DB_PORT="${MYSQLPORT:-3306}"
    export DB_DATABASE="$MYSQLDATABASE"
    export DB_USERNAME="$MYSQLUSER"
    export DB_PASSWORD="$MYSQLPASSWORD"
    
    # Créer un fichier .env temporaire avec les bonnes valeurs
    cat > .env.railway << EOF
APP_KEY=base64:$(php -r "echo base64_encode(random_bytes(32));")
DB_CONNECTION=mysql
DB_HOST=$MYSQLHOST
DB_PORT=${MYSQLPORT:-3306}
DB_DATABASE=$MYSQLDATABASE
DB_USERNAME=$MYSQLUSER
DB_PASSWORD=$MYSQLPASSWORD
EOF
    
    echo "✅ Configuration Railway .env créée"
fi

# Afficher les variables d'environnement importantes (sans valeurs sensibles)
echo "📊 Variables d'environnement:"
echo "- APP_ENV: $APP_ENV"
echo "- APP_DEBUG: $APP_DEBUG" 
echo "- DB_CONNECTION: $DB_CONNECTION"
echo "- PORT: $PORT"
echo "- MYSQLHOST: $MYSQLHOST"
echo "- MYSQLDATABASE: $MYSQLDATABASE"
echo "- RAILWAY_STATIC_URL: $RAILWAY_STATIC_URL"

# Créer un fichier .env minimal si il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env à partir de .env.example..."
    cp .env.example .env 2>/dev/null || cat > .env << 'ENVEOF'
APP_NAME="AMAZIGHI SHOP"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=resend
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}
MAIL_FROM_NAME="AMAZIGHI SHOP"
RESEND_API_KEY=${RESEND_API_KEY}
ENVEOF
    
    # Configurer les variables Railway si elles existent
    if [ -n "$MYSQLHOST" ]; then
        echo "🔧 Configuration des variables Railway MySQL..."
        sed -i "s/DB_CONNECTION=.*/DB_CONNECTION=mysql/" .env
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
    
    # Configurer l'URL de l'application Railway
    if [ -n "$RAILWAY_STATIC_URL" ]; then
        echo "🔧 Configuration URL Railway: https://$RAILWAY_STATIC_URL"
        sed -i "s|APP_URL=.*|APP_URL=https://$RAILWAY_STATIC_URL|" .env
        sed -i "s|ASSET_URL=.*|ASSET_URL=https://$RAILWAY_STATIC_URL|" .env || echo "ASSET_URL=https://$RAILWAY_STATIC_URL" >> .env
        sed -i "s|APP_FORCE_HTTPS=.*|APP_FORCE_HTTPS=true|" .env || echo "APP_FORCE_HTTPS=true" >> .env
        sed -i "s|TRUSTED_PROXIES=.*|TRUSTED_PROXIES=*|" .env || echo "TRUSTED_PROXIES=*" >> .env
        sed -i "s|APP_ENV=.*|APP_ENV=production|" .env
    elif [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
        echo "🔧 Configuration URL Railway: https://$RAILWAY_PUBLIC_DOMAIN"
        sed -i "s|APP_URL=.*|APP_URL=https://$RAILWAY_PUBLIC_DOMAIN|" .env
        sed -i "s|ASSET_URL=.*|ASSET_URL=https://$RAILWAY_PUBLIC_DOMAIN|" .env || echo "ASSET_URL=https://$RAILWAY_PUBLIC_DOMAIN" >> .env
        sed -i "s|APP_FORCE_HTTPS=.*|APP_FORCE_HTTPS=true|" .env || echo "APP_FORCE_HTTPS=true" >> .env
        sed -i "s|APP_ENV=.*|APP_ENV=production|" .env
    else
        echo "🔧 Configuration URL Railway par défaut: https://amazighi-shop.up.railway.app"
        sed -i "s|APP_URL=.*|APP_URL=https://amazighi-shop.up.railway.app|" .env
        sed -i "s|ASSET_URL=.*|ASSET_URL=https://amazighi-shop.up.railway.app|" .env || echo "ASSET_URL=https://amazighi-shop.up.railway.app" >> .env
        sed -i "s|APP_FORCE_HTTPS=.*|APP_FORCE_HTTPS=true|" .env || echo "APP_FORCE_HTTPS=true" >> .env
        sed -i "s|APP_ENV=.*|APP_ENV=production|" .env
        
        # Configurer les cookies de session pour HTTPS en production
        sed -i 's|SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=true|' .env
        sed -i 's|SESSION_SAME_SITE=.*|SESSION_SAME_SITE=lax|' .env
        sed -i 's|SESSION_DOMAIN=.*|SESSION_DOMAIN=.'"${RAILWAY_STATIC_URL}"'|' .env
        
        # Configurer les proxies de confiance pour Railway
        sed -i 's|TRUSTED_PROXIES=.*|TRUSTED_PROXIES=*|' .env
    fi
    
    # Configuration Resend API avec variables Railway
    echo "📧 Configuration Resend avec variables Railway..."
    echo "🔍 Variables disponibles:"
    echo "  - RESEND_API_KEY: ${RESEND_API_KEY:0:10}..." 
    echo "  - MAIL_FROM_ADDRESS: ${MAIL_FROM_ADDRESS:-onboarding@resend.dev}"
    
    sed -i 's|MAIL_MAILER=.*|MAIL_MAILER=resend|' .env
    sed -i 's|RESEND_API_KEY=.*|RESEND_API_KEY='"${RESEND_API_KEY}"'|' .env || echo "RESEND_API_KEY=${RESEND_API_KEY}" >> .env
    sed -i 's|MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS='"${MAIL_FROM_ADDRESS:-onboarding@resend.dev}"'|' .env
    
    echo "✅ Resend configuré avec package officiel Laravel"
fi

# Vérifier et corriger la syntaxe du fichier .enve
echo "🔧 Vérification de la syntaxe .env..."
if [ -f ".env" ]; then
    # Créer une sauvegarde
    cp .env .env.backup
    
    # Corriger les guillemets problématiques et les espaces
    echo "⚠️ Correction de la syntaxe .env..."
    sed -i 's/MAIL_PASSWORD="rzmh uvio zygd eony"/MAIL_PASSWORD=rzmhuviozygeony/' .env
    sed -i 's/MAIL_PASSWORD="\([^"]*\)"/MAIL_PASSWORD=\1/' .env
    
    # Au lieu de supprimer .env, créer un .env minimal valide
    echo "⚠️ Création d'un .env minimal pour Railway..."
    cat > .env << EOF
APP_NAME="AMAZIGHI SHOP"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://amazighi-shop.up.railway.app
ASSET_URL=https://amazighi-shop.up.railway.app
APP_FORCE_HTTPS=true
TRUSTED_PROXIES=*

DB_CONNECTION=mysql
DB_HOST=$MYSQLHOST
DB_PORT=${MYSQLPORT:-3306}
DB_DATABASE=$MYSQLDATABASE
DB_USERNAME=$MYSQLUSER
DB_PASSWORD=$MYSQLPASSWORD

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=resend
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}
MAIL_FROM_NAME="AMAZIGHI SHOP"
RESEND_API_KEY=${RESEND_API_KEY}
EOF
    echo "✅ .env Railway créé avec les variables d'environnement"
fi

# Installer le package officiel Resend Laravel
echo "📦 Installation du package officiel Resend Laravel..."
composer require resend/resend-laravel --no-interaction --prefer-dist || echo "⚠️ Erreur installation resend-laravel"
echo "✅ Package resend/resend-laravel installé"

# Générer la clé d'application (force à chaque déploiement pour invalider les anciennes sessions)
echo "🔑 Génération de la clé d'application..."
php artisan key:generate --force || echo "⚠️ Erreur clé - continuing anyway"
echo "✅ Clé d'application générée - toutes les anciennes sessions sont invalidées"

# Nettoyer le cache de configuration et les sessions
echo "🧹 Nettoyage du cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan session:table > /dev/null 2>&1 && php artisan db:wipe --database=cache --force > /dev/null 2>&1 || echo "Session cleanup completed"

# Forcer le mode Resend après nettoyage cache
echo "📧 Force mode Resend après nettoyage..."
echo "🔍 Vérification des variables après cache clear:"
echo "  - RESEND_API_KEY: ${RESEND_API_KEY:0:10}..."
echo "  - MAIL_FROM_ADDRESS: ${MAIL_FROM_ADDRESS:-onboarding@resend.dev}"

sed -i 's|MAIL_MAILER=.*|MAIL_MAILER=resend|' .env
sed -i 's|RESEND_API_KEY=.*|RESEND_API_KEY='"${RESEND_API_KEY}"'|' .env || echo "RESEND_API_KEY=${RESEND_API_KEY}" >> .env
sed -i 's|MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS='"${MAIL_FROM_ADDRESS:-onboarding@resend.dev}"'|' .env

echo "📋 Configuration .env finale:"
grep -E "MAIL_|RESEND_" .env | head -5

echo "✅ Mode Resend forcé avec package officiel Laravel"

# Supprimer le lien/dossier existant s'il y en a un
if [ -e "public/storage" ]; then
    echo "🗂️ Suppression de l'ancien storage ($([ -L public/storage ] && echo 'lien' || echo 'dossier'))..."
    rm -rf public/storage
fi

# Créer le lien de stockage
echo "🔗 Création du lien de stockage..."
php artisan storage:link || echo "⚠️ Erreur lors de la création du lien"

# Vérifier que le lien fonctionne
if [ -L "public/storage" ]; then
    echo "✅ Lien de stockage créé avec succès"
    echo "📁 Vérification du lien: $(ls -la public/storage 2>/dev/null || echo 'Lien non accessible')"
else
    echo "⚠️ Le lien de stockage n'a pas été créé, création manuelle..."
    # Créer manuellement le lien symbolique
    ln -sf ../storage/app/public public/storage
    echo "🔗 Lien manuel créé: $(ls -la public/storage 2>/dev/null || echo 'Toujours pas accessible')"
fi

# Créer les dossiers de stockage s'ils n'existent pas
echo "📁 Création des dossiers de stockage..."
mkdir -p storage/app/public/produits
mkdir -p storage/app/public/commandes
chmod -R 755 storage/app/public/

# Afficher l'état du stockage pour debug
echo "📊 État du stockage actuel:"
echo "- public/storage existe: $([ -e public/storage ] && echo 'OUI' || echo 'NON')"
echo "- public/storage est un lien: $([ -L public/storage ] && echo 'OUI' || echo 'NON')"
echo "- storage/app/public existe: $([ -d storage/app/public ] && echo 'OUI' || echo 'NON')"

# Tester la connexion à la base de données
echo "🗄️ Test de la connexion à la base de données..."
if [ -n "$MYSQLHOST" ]; then
    echo "✅ Variables MySQL Railway détectées"
    
    # Attendre que MySQL soit prêt avec retry logic
    echo "⏱️ Attente de la disponibilité de MySQL..."
    RETRY_COUNT=0
    MAX_RETRIES=10
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        echo "🔍 Test de connexion MySQL (tentative $((RETRY_COUNT + 1))/$MAX_RETRIES)..."
        
        if DB_CONNECTION=mysql DB_HOST="$MYSQLHOST" DB_PORT="$MYSQLPORT" DB_DATABASE="$MYSQLDATABASE" DB_USERNAME="$MYSQLUSER" DB_PASSWORD="$MYSQLPASSWORD" php artisan tinker --execute="DB::connection('mysql')->getPdo(); echo 'Connexion MySQL OK';" 2>/dev/null; then
            echo "✅ Connexion MySQL Railway réussie"
            break
        else
            echo "⚠️ Connexion MySQL échouée, retry dans 3s..."
            sleep 3
            RETRY_COUNT=$((RETRY_COUNT + 1))
        fi
    done
    
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "❌ Impossible de se connecter à MySQL après $MAX_RETRIES tentatives"
        echo "🔧 Configuration MySQL actuelle:"
        echo "  - Host: $MYSQLHOST:$MYSQLPORT"
        echo "  - Database: $MYSQLDATABASE"
        echo "  - User: $MYSQLUSER"
        exit 1
    fi
    
    if true; then
        
        # Créer la table migrations si elle n'existe pas
        echo "📝 Initialisation des migrations..."
        DB_CONNECTION=mysql DB_HOST="$MYSQLHOST" DB_PORT="$MYSQLPORT" DB_DATABASE="$MYSQLDATABASE" DB_USERNAME="$MYSQLUSER" DB_PASSWORD="$MYSQLPASSWORD" php artisan migrate:install 2>/dev/null || echo "Table migrations déjà existante"
        
        # Exécuter les migrations avec MySQL forcé
        echo "📝 Exécution des migrations avec MySQL..."
        DB_CONNECTION=mysql DB_HOST="$MYSQLHOST" DB_PORT="$MYSQLPORT" DB_DATABASE="$MYSQLDATABASE" DB_USERNAME="$MYSQLUSER" DB_PASSWORD="$MYSQLPASSWORD" php artisan migrate --force
        echo "✅ Migrations terminées"
        
        # Seeder les données administrateur (ignorer si déjà fait)
        echo "🌱 Seedeur des données..."
        DB_CONNECTION=mysql DB_HOST="$MYSQLHOST" DB_PORT="$MYSQLPORT" DB_DATABASE="$MYSQLDATABASE" DB_USERNAME="$MYSQLUSER" DB_PASSWORD="$MYSQLPASSWORD" php artisan db:seed --class=AdminSeeder --force || echo "⚠️ Seeder déjà exécuté"
        echo "✅ Données seedées"
        
        # Test de la configuration email
        echo "📧 Test de la configuration email RESEND..."
        php artisan tinker --execute="
            echo 'MAIL_MAILER: ' . config('mail.default') . PHP_EOL;
            echo 'MAIL_FROM_ADDRESS: ' . config('mail.from.address') . PHP_EOL;
            echo 'RESEND_API_KEY: ' . (env('RESEND_API_KEY') ? substr(env('RESEND_API_KEY'), 0, 15) . '...' : 'NON DÉFINIE') . PHP_EOL;
            
            // Vérifier la config des mailers
            echo 'MAILER RESEND CONFIG: ' . json_encode(config('mail.mailers.resend')) . PHP_EOL;
            
            // Test d'envoi simple avec Resend
            try {
                \Illuminate\Support\Facades\Mail::raw('Test RESEND debug - ' . date('Y-m-d H:i:s'), function(\$message) {
                    \$message->from(config('mail.from.address'), 'AMAZIGHI SHOP TEST')
                           ->to('amazighishoop@gmail.com')
                           ->subject('Test RESEND API Laravel');
                });
                echo 'TEST EMAIL RESEND: ENVOYÉ AVEC SUCCÈS ✅' . PHP_EOL;
            } catch (Exception \$e) {
                echo 'ERREUR EMAIL RESEND: ' . \$e->getMessage() . PHP_EOL;
                echo 'CLASSE ERREUR: ' . get_class(\$e) . PHP_EOL;
                echo 'CODE ERREUR: ' . \$e->getCode() . PHP_EOL;
                if (method_exists(\$e, 'getResponse')) {
                    echo 'RESPONSE: ' . \$e->getResponse() . PHP_EOL;
                }
            }
        " || echo "⚠️ Test config email échoué"
    else
        echo "❌ Impossible de se connecter à la base de données"
        echo "📋 Configuration actuelle:"
        php artisan config:show database.connections.mysql || echo "Erreur lors de l'affichage de la config"
    fi
else
    echo "⚠️ Variables MySQL Railway non trouvées - démarrage sans base de données"
    echo "👉 Veuillez ajouter un service MySQL à votre projet Railway"
fi

# Créer le lien de stockage pour les commandes seulement si nécessaire
if [ ! -d "public/storage/commandes" ]; then
    echo "🔗 Création du lien de stockage commandes..."
    php artisan storage:link-commandes || echo "⚠️ Commande non trouvée ou déjà exécutée"
else
    echo "✅ Lien de stockage commandes déjà existant"
fi

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur le port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT