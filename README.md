💬 Projet IRC Server - Node.js, React, Socket.io
🧠 Description
Ce projet a pour but de créer un serveur IRC moderne et interactif en utilisant Node.js, Express.js, Socket.io, et React.js.
Il permet à plusieurs utilisateurs de se connecter, de discuter en temps réel, de créer des channels (salons), de rejoindre plusieurs channels simultanément, et de gérer leurs interactions via des commandes ou une interface intuitive.

Dévs : Badjiry Diakité et Aissatou-labbo.sow

🚀 Stack utilisée
Backend :

Node.js

Express.js

Socket.io (websockets & rooms)

Frontend :

React.js (UI réactive et moderne)

📦 Fonctionnalités principales
👥 Gestion des utilisateurs
Connexion via un nom d'utilisateur.

Modification des informations utilisateur (ex: pseudo).

Suivi des utilisateurs connectés par channel.

🛠️ Gestion des channels
Création et suppression de channels.

Créateur d’un channel = seul à pouvoir le modifier/supprimer.

Auto-suppression d’un channel inactif depuis 5 minutes (2 jours en production).

Notifications globales pour création, suppression de channels et changements de pseudo.

Chaque utilisateur peut rejoindre plusieurs channels simultanément.

💬 Gestion des messages
Envoi de messages par channel.

Affichage des messages uniquement aux utilisateurs du même channel.

Commandes de chat intégrées.

🔧 Commandes disponibles
Commande	Description
/nick <nickname>	Change le pseudo de l'utilisateur
/list [string]	Liste les channels, ou ceux contenant string
/create <channel>	Crée un channel
/delete <channel>	Supprime un channel (si créateur)
/join <channel>	Rejoint un channel
/leave <channel>	Quitte un channel
/users	Liste des utilisateurs dans le channel actuel
/msg <nickname> <message>	Envoie un message privé
message	Envoie un message dans le channel courant

⚠️ L’envoi des messages se fait en appuyant sur Entrée. Pas de sauts de ligne autorisés.

💻 Interface utilisateur (React)
Interface intuitive et responsive.

Système d’onglets pour naviguer entre les channels.

Composants réactifs et dynamiques pour les messages, utilisateurs, channels.

Formulaire de connexion simple (saisir un pseudo).

🎁 Bonus possibles (non obligatoires)
BBCode dans les messages.

Intégration d’emojis.

Auto-complétion des commandes, pseudos et noms de channels.

Auto-lien des #channels et @usernames.

Ctrl + Entrée pour retour à la ligne.

Respect partiel de la RFC1459.

Utilisation d’une base de données (MongoDB) pour persister :

Channels existants.

Infos utilisateurs.

Historique des messages (optionnel).

▶️ Lancer le projet
Backend
bash
Copier
Modifier
cd server
npm install
node server.js

Frontend
bash
Copier
Modifier
cd client
npm install
npm run dev

📁 Arborescence 
/client         # Frontend React
/server         # Backend Express + Socket.io
README.md

✅ À faire pour la soutenance
Réduire le délai d’auto-suppression de channel à 5 minutes.

Avoir au minimum un CRUD complet des channels.

Interface fonctionnelle pour rejoindre, créer, quitter un channel.

Toutes les commandes de base opérationnelles.

Plusieurs utilisateurs connectés en simultané.

 Auteur

Diakité Badjiry.

