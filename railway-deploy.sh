#!/bin/bash

# Script de déploiement pour Railway
set -e

echo "🚀 Début du déploiement Railway..."

# Vérifier la version Node.js
echo "📦 Version Node.js: $(node --version)"
echo "📦 Version NPM: $(npm --version)"
echo "🐘 Version PHP: $(php --version | head -n1)"
echo "🎼 Version Composer: $(composer --version)"

# Installation des dépendances
echo "🔧 Installation des dépendances NPM..."
npm ci --prefer-offline --no-audit --progress=false

echo "🔧 Installation des dépendances Composer..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Build des assets
echo "🏗️ Build des assets..."
npm run build

# Vérification des fichiers
echo "✅ Vérification des fichiers buildés..."
if [ ! -d "public/build" ]; then
    echo "❌ Erreur: Le dossier public/build n'existe pas!"
    exit 1
fi

echo "✅ Build terminé avec succès!"
echo "📁 Contenu de public/build:"
ls -la public/build/

# Génération de la clé d'application si nécessaire
if [ -z "$APP_KEY" ]; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate --force
fi

echo "🚀 Déploiement terminé avec succès!"