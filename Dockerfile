## BUILD STAGE
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

## PRODUCTION STAGE
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/build ./build

RUN npm install -g serve

CMD ["serve", "-sn", "build", "--ssl-cert", "./cert.pem", "--ssl-key", "./key.pem"]