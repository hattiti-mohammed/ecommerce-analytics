# E-commerce Analytics Backend

Backend pour l'outil d'analyse des paniers d'achat, développé avec Node.js, TypeScript, Express, et MongoDB.

## Table des Matières

- [Présentation](#présentation)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Peuplement de la Base de Données](#peuplement-de-la-base-de-données)
- [Exécution](#exécution)
- [Tests](#tests)
- [Documentation de l'API](#documentation-de-lapi)
- [Bonnes Pratiques](#bonnes-pratiques)

## Présentation

Cet API permet d'analyser les données des paniers d'achat d'un site e-commerce. Il fournit des informations sur les ventes totales, les produits les plus vendus, et la répartition des ventes par catégorie.

## Technologies Utilisées

- **Node.js** avec **Express** pour le serveur.
- **TypeScript** pour la typage statique.
- **MongoDB** avec **Mongoose** pour la base de données.
- **CSV Parser** pour importer les données depuis les fichiers CSV.
- **Jest** et **Supertest** pour les tests.
- **Swagger** pour la documentation de l'API.

## Installation

1. **Cloner le Repository**

   ```bash
   git clone https://github.com/votre-utilisateur/ecommerce-analytics-backend.git
   cd ecommerce-analytics-backend
