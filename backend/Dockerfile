FROM node:18-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY backend/. .

EXPOSE 3001

CMD ["npm", "run", "backend_prod"]