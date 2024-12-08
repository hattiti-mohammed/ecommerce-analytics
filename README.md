# Tableau de Bord E-commerce

## 🚀 Fonctionnalités

- Visualisation des ventes totales
- Graphiques des produits les plus vendus
- Distribution des ventes par catégorie
- Liste paginée des produits avec recherche et tri
- Interface moderne et responsive

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (version 4.4 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. Clonez le projet :
```bash
git clone [https://github.com/hattiti-mohammed/ecommerce-analytics.git]
```

2. Installation des dépendances du backend :
```bash
cd ecommerce-analytics-backend
npm install
```

3. Installation des dépendances du frontend :
```bash
cd ecommerce-analytics-frontend
npm install
```

## 💾 Configuration de la Base de Données

1. Assurez-vous que MongoDB est en cours d'exécution sur votre machine
2. La base de données sera créée automatiquement lors du chargement des données

## 📥 Chargement des Données

Pour charger les données de test dans MongoDB :

```bash
cd ecommerce-analytics-backend
npm run load-data
```

## 🚀 Démarrage de l'Application

1. Démarrez le serveur backend :
```bash
cd ecommerce-analytics-backend
npm run dev
```

2. Dans un nouveau terminal, démarrez le frontend :
```bash
cd ecommerce-analytics-frontend
npm run dev
```

3. Accédez à l'application dans votre navigateur :
```
http://localhost:5173
```

## 📊 Utilisation

- **Période** : Sélectionnez la période d'analyse (7 jours, 30 jours, 12 mois)
- **Produits** : 
  - Utilisez la barre de recherche pour filtrer les produits
  - Cliquez sur les en-têtes de colonnes pour trier les données
  - Utilisez la pagination pour naviguer entre les pages
- **Graphiques** : Survolez les graphiques pour voir les détails

## 🔧 Structure du Projet

```
project/
├── ecommerce-analytics-backend/    # Serveur Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/           # Contrôleurs de l'API
│   │   ├── models/               # Modèles de données
│   │   └── server.ts             # Point d'entrée du serveur
│   └── scripts/                  # Scripts utilitaires
└── ecommerce-analytics-frontend/   # Application Vue.js
    ├── src/
    │   ├── components/           # Composants Vue
    │   ├── services/            # Services API
    │   └── views/               # Pages de l'application
    └── public/                  # Ressources statiques
```

## 📝 Notes Importantes

- Le serveur backend fonctionne sur le port 5000
- L'application frontend fonctionne sur le port 5173
- Assurez-vous que MongoDB est en cours d'exécution avant de démarrer l'application
- Les données de test sont chargées à partir des fichiers CSV dans le dossier racine

## 🐛 Résolution des Problèmes Courants

1. **Erreur de connexion MongoDB** :
   - Vérifiez que MongoDB est en cours d'exécution
   - Vérifiez le port par défaut (27017)

2. **Erreur de chargement des données** :
   - Assurez-vous que les fichiers CSV sont présents dans le bon dossier
   - Vérifiez les permissions des fichiers

3. **Erreur de démarrage du frontend** :
   - Vérifiez que le backend est en cours d'exécution
   - Vérifiez les variables d'environnement 