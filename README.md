# Crash course IoT

## Introduction

Ceci est le repo contenant "notre solution" pour le cas d'utilisation du Crash Course IoT.

## Code

Le fichier Edison contient le code allant sur l'Intel Edison. </br>
Le fichier Lambda contient le code allant sur AWS Lambda.

## Déploiement

Edison:</br>
Créer un nouveau projet sur le XDK Intel IoT, y importer le code Edison du git et tout les fichiers liés à l'authentification (certificats, polices, clés). </br>
Modifier le chemin d'accès aux fichiers d'authentification dans le code.</br>
Connecter l'intel Edison à l'ordinateur, puis téléverser le projet sur la carte.</br></br>

Lambda:</br>
Rendez vous sur la console Lambda d'AWS, puis créer une nouvelle fonction nodeJS.</br>
Téléversez le code dans la fonction puis liez votre règle AWS IoT à votre fonction Lambda.</br>

## Schéma d'architecture
