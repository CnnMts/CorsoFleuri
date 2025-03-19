
# Utiliser une image Node.js officielle
FROM node:20

# Définir le répertoire de travail à l'intérieur du container
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances (même s'il n'y a pas de dépendances, ça garantit que tout est à jour)
RUN npm install

# Copier l'ensemble des fichiers du dossier front dans le container
COPY . .

# Exposer le port sur lequel votre serveur Node écoute (votre code démarre sur le port 3000)
EXPOSE 3000

# Démarrer l'application via le script "start" défini dans package.json
CMD [ "npm", "start" ]