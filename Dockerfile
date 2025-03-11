FROM node:20.18.2
WORKDIR /www
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD ["node", "server.js"]
