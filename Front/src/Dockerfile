# Étape 1 : Construction
FROM node:20 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Étape 2 : Production
FROM node:20
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 8085
CMD [ "npm", "start" ]
