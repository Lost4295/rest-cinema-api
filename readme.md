# Documentation

## Installation

Lancer l'API

```bash
  npm install 
  npm run prisma:generate --schema=./src/db/schema.prisma
  npm run build
  cp -rp src/db/client dist/db/client
  node dist/main.js
  
```

Si on veut lancer tout le module qui est dockerisé :

```bash
  docker compose -f docker-compose-prod.yaml up -d
```

## ⚠️ Attention

Attention à bien modifier les variables d’environnement dans le fichier .env si besoin

## Lien

- [@API](https://laporteacote.online)
- [@Grafana](https://laporteacote.online:7181)
- [@Prometheus](https://laporteacote.online:9090)
- [@Github](https://github.com/Lost4295/rest-cinema-api)

[![Tests and build](https://github.com/Lost4295/rest-cinema-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lost4295/rest-cinema-api/actions/workflows/node.js.yml)
[![Deployment](https://github.com/Lost4295/rest-cinema-api/actions/workflows/cd.yml/badge.svg)](https://github.com/Lost4295/rest-cinema-api/actions/workflows/cd.yml)
