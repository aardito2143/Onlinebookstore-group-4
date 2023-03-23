# Use NodeJS 18 for maximum compatibility.
FROM node:18-alpine

# Set the working directory to /backend
WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY backend/. .

EXPOSE 3001

CMD ["npm", "run", "backend_prod"]