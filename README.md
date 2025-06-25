# Application de Partage d'Écran

## Installation

1. Installer Node.js
2. Exécuter: `npm install`
3. Lancer l'application: `npm start`

## Publication

### Première fois :
1. Créer le repository `screen-share-updater` sur GitHub
2. `git init && git add . && git commit -m "Initial"`
3. `git remote add origin https://github.com/LeGrandZix/screen-share-updater.git`
4. `git push -u origin main`
5. Créer un token GitHub (Settings > Developer settings > Personal access tokens)
6. `publish.bat VOTRE_TOKEN`

### Mises à jour :
1. Modifier version dans package.json
2. `git add . && git commit -m "v1.x.x" && git push`
3. `publish.bat VOTRE_TOKEN`

## Fonctionnalités
- Mise à jour automatique au démarrage
- Vérification manuelle via bouton
- Installation après confirmation

## Fonctionnalités

- Partage d'écran local
- Interface simple pour créer/rejoindre des salles
- Base WebRTC pour connexions peer-to-peer

## Note

Cette version est une base fonctionnelle. Pour un partage complet entre amis, vous devrez:

1. Implémenter un serveur de signalisation WebSocket
2. Ajouter la gestion complète des connexions WebRTC
3. Gérer les erreurs et reconnexions

## Structure WebRTC complète

Pour une implémentation complète, ajoutez un serveur Node.js avec Socket.IO pour la signalisation entre pairs.