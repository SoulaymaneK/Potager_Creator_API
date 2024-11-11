# API PotagerCreator

API pour la gestion de potagers utilisant des données météorologiques pour recommander les meilleures périodes de plantation selon la localisation géographique et les données météorologiques. 

## Table des matières

1. [Description du projet](#description-du-projet)
2. [Fonctionnalités](#fonctionnalités)
3. [Prérequis](#prérequis)
4. [Installation](#installation)
5. [Utilisation](#utilisation)
6. [Architecture](#architecture)
7. [Sécurité](#sécurité)
8. [Améliorations futures](#améliorations-futures)
9. [Auteurs](#auteurs)
10. [Remerciements](#remerciements)

---

## Description du projet

PotagerCreator est une API permettant aux jardiniers amateurs et professionnels de planifier et gérer leurs potagers en fonction des conditions météorologiques. Elle utilise un moteur de calcul en Python pour prédire les périodes optimales de plantation pour divers végétaux. Ce projet a été développé dans le cadre d'un TX à l'Université de Technologie de Compiègne.

## Fonctionnalités

- Création et gestion de profils utilisateurs et administrateurs.
- Gestion des jardins et des végétaux associés (ajout, modification, suppression).
- Recommandations de plantation basées sur les données météo locales.
- Notifications pour les utilisateurs sur les périodes de plantation et d’entretien.
- Sécurisation des accès avec vérification de rôles et cryptage des mots de passe.

## Prérequis

- **Python** >= 3.8
- **Node.js** >= 12.0 et **npm**
- **PostgreSQL** >= 12
- [Bibliothèques Python](requirements.txt) :
  - geopy
  - meteostat
  - pandas
  - bcrypt

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/username/potagercreator.git
   cd potagercreator
   ```

2. Installez les dépendances Python :
   ```bash
   pip install -r requirements.txt
   ```

3. Installez les dépendances Node.js :
   ```bash
   npm install
   ```

4. Configurez la base de données PostgreSQL et mettez à jour le fichier `.env` avec vos informations de connexion.

5. Démarrez l’API :
   ```bash
   npm start
   ```

## Architecture

Le projet est basé sur une architecture en couches et utilise les technologies suivantes :
- **Backend** : Node.js avec Express pour les routes et la gestion des requêtes.
- **Base de données** : PostgreSQL pour stocker les utilisateurs, les jardins et les végétaux.
- **Moteur de calcul prévisionnel** : Python, qui analyse les données météorologiques et propose des mois optimaux pour la plantation.

## Sécurité

- Cryptage des mots de passe avec bcrypt.
- Requêtes paramétrées pour éviter les injections SQL.
- Gestion des sessions et rôles utilisateurs avec des middlewares.

## Améliorations futures

- Hébergement de la base de données dans le cloud.
- Prise en compte de paramètres supplémentaires pour les recommandations de plantation, comme l’humidité et la pluviométrie.
- Intégration de capteurs IoT pour des données en temps réel.

## Auteurs

- **Esther-Louise Fabre**
- **Soulaymane Kebli**

## Remerciements

Un remerciement spécial à Mr. Abdelmadjid Bouabdallah pour son encadrement et son soutien tout au long du projet, ainsi qu’à toute l’équipe enseignante de l’Université de Technologie de Compiègne.