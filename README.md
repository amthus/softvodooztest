# Bookshelf App - Application de Gestion d'Étagères de Livres

> Application NextJS développée dans le cadre d'un test technique pour le recrutement d'un développeur frontend.

## Explication du Projet

### Contexte et Objectif

Cette application web moderne a été conçue pour **démontrer la maîtrise de l'écosystème React/NextJS** à travers la création d'une interface de gestion d'étagères de livres. Le projet répond à un besoin concret : permettre aux utilisateurs de **naviguer intuitivement** dans une collection organisée de livres, avec des fonctionnalités avancées de recherche et de pagination.

**Objectifs techniques :**
- Intégration d'une API REST externe (Glose API)
- Gestion d'états complexes avec hooks personnalisés
- Interface utilisateur moderne et responsive
- Architecture scalable et maintenable
- Tests unitaires et d'intégration


### Installation et Utilisation

#### Prérequis
\`\`\`bash
Node.js 18+ 
npm ou yarn
\`\`\`

#### Installation
\`\`\`bash
# Cloner le repository
git clone [URL_DU_REPO]
cd bookshelf-app

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
\`\`\`

#### Scripts Disponibles
\`\`\`bash
npm run dev          # Développement (http://localhost:3000)
npm run build        # Build de production
npm run start        # Serveur de production
npm run test         # Tests unitaires
npm run lint         # Vérification ESLint
\`\`\`

### Fonctionnalités Principales

#### 1. **Gestion des Étagères**
- **Chargement automatique** des étagères au démarrage
- **Affichage en grille responsive** avec informations détaillées
- **Pagination intelligente** avec bouton "Charger plus"
- **Gestion d'erreurs** avec retry automatique

#### 2. **Navigation dans les Livres**
- **Sélection d'étagère** → Chargement automatique des livres
- **Chargement parallèle** des détails de livres pour optimiser les performances
- **Affichage riche** : couverture, titre, auteur, prix, note
- **États de chargement** avec skeletons animés

#### 3. **Recherche Avancée**
- **Recherche en temps réel** par titre et auteur
- **Filtres multiples** : note minimum, prix maximum
- **Debouncing** pour optimiser les performances
- **Compteur de résultats** dynamique

#### 4. **Pagination Optimisée**
- **Chargement par chunks** (12 livres par page)
- **Scroll infini** avec bouton "Charger plus"
- **Gestion de l'état** : hasMore, loading, error
- **Performance** : pas de rechargement des données existantes

#### 5. **Gestion d'Erreurs Robuste**
- **Error Boundaries** React pour isoler les erreurs
- **Retry automatique** avec backoff exponentiel
- **Messages utilisateur** explicites en français
- **Fallbacks gracieux** pour les données manquantes

### Tests Réalisés

#### Tests Unitaires (Jest + RTL)
\`\`\`bash
npm test                    # Tous les tests
npm run test:coverage       # Avec couverture de code
\`\`\`


#### Tests d'Intégration
- **Flux utilisateur complet** : Étagères → Livres → Recherche
- **Gestion d'erreurs API** : Simulation de pannes réseau
- **Performance** : Chargement parallèle, temps de réponse

