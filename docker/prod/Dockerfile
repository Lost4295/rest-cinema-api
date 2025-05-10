FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances depuis la racine du projet
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copier le reste du projet (depuis la racine)
COPY src ./src
COPY .env.production .env
COPY tsconfig.json ./
COPY s.sh startscript.sh

# Exposer le port utilisé par l'API
EXPOSE 3000

RUN chmod +x startscript.sh && npx tsc && \
                               npm run prisma:generate --schema=./src/db/schema.prisma && \
                               cp -rp src/db/client dist/db/client

# Lancer l'application via Node.js en mode CommonJS
CMD ["node", "dist/main.js"]
