#!/bin/bash

# Script pour gérer les fichiers de stockage sur Railway

echo "🗂️ Configuration du stockage Railway..."

# Créer les dossiers de stockage s'ils n'existent pas
mkdir -p /app/storage/app/public/produits
mkdir -p /app/storage/app/public/commandes
mkdir -p /app/public/storage/produits
mkdir -p /app/public/storage/commandes

# Créer le lien symbolique si il n'existe pas
if [ ! -L "/app/public/storage" ]; then
    echo "🔗 Création du lien symbolique storage..."
    ln -sf /app/storage/app/public /app/public/storage
else
    echo "✅ Lien symbolique storage déjà existant"
fi

# Vérifier les permissions
echo "🔐 Configuration des permissions..."
chmod -R 755 /app/storage/app/public/
chmod -R 755 /app/public/storage/

echo "✅ Configuration du stockage terminée"

# Afficher l'état du stockage
echo "📊 État du stockage:"
ls -la /app/public/storage/ 2>/dev/null || echo "Aucun fichier de stockage pour le moment"