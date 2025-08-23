#!/bin/bash

echo "🚀 Déploiement Railway AMAZIGHI SHOP..."

# Nettoyer les anciens builds
echo "🧹 Nettoyage des anciens builds..."
rm -rf public/build
rm -rf node_modules/.vite

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci --prefer-offline --no-audit --progress=false

# Build des assets pour production
echo "🔨 Build des assets en mode production..."
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build:railway

# Vérifier que le build a réussi
if [ ! -f "public/build/manifest.json" ]; then
    echo "❌ Build failed - manifest.json not found"
    exit 1
fi

echo "✅ Build réussi!"
echo "📋 Contenu du manifest:"
head -3 public/build/manifest.json

# Optimiser Composer
echo "🎼 Optimisation de Composer..."
composer install --optimize-autoloader --no-interaction --prefer-dist --no-dev

# Informations utiles
echo "📊 Taille du dossier build:"
du -sh public/build/

echo "✅ Prêt pour Railway!"
echo "👉 Variables d'environnement à configurer sur Railway:"
echo "   - APP_ENV=production"
echo "   - APP_DEBUG=false"
echo "   - APP_URL=https://amazighi-shop.up.railway.app"
echo "   - ASSET_URL=https://amazighi-shop.up.railway.app"