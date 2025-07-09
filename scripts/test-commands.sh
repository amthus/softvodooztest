#!/bin/bash

echo "🧪 Guide de Test de l'Application Bookshelf"
echo "=========================================="

echo "📋 1. Tests Unitaires"
echo "npm test                    # Lancer tous les tests"
echo "npm run test:watch          # Tests en mode watch"
echo "npm run test:coverage       # Tests avec couverture"

echo ""
echo "🔍 2. Tests Spécifiques"
echo "npm test -- api.test.ts     # Tests du service API"
echo "npm test -- use-search      # Tests du hook de recherche"
echo "npm test -- bookshelf-list  # Tests du composant liste"

echo ""
echo "⚡ 3. Tests de Performance"
echo "npm run build               # Build de production"
echo "npm run start               # Serveur de production"
echo "# Puis ouvrir Lighthouse dans Chrome DevTools"

echo ""
echo "🔧 4. Vérifications de Code"
echo "npm run lint                # Vérification ESLint"
echo "npm run type-check          # Vérification TypeScript"

echo ""
echo "🌐 5. Tests Cross-Browser"
echo "# Tester sur Chrome, Firefox, Safari, Edge"
echo "# Tester sur mobile (responsive)"
