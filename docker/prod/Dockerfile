FROM node:18-alpine


WORKDIR /app
COPY grafana grafana
COPY loki loki
COPY prometheus prometheus
COPY src src
COPY tests tests
COPY .env.production .env
RUN npm install
EXPOSE 3000

CMD ["ts-node", "src/index.ts"]
