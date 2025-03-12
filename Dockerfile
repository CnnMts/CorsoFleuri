FROM node:20.18.2
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8082
CMD ["npm", "run", "dev"]
