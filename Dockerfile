FROM node:20-alpine

WORKDIR /app

RUN rm -rf /app/*
COPY package.json ./

COPY package-lock.json ./
RUN npm install

COPY tsconfig.json ./
RUN ls -la /app

COPY src ./src
RUN npm run build

EXPOSE 8010

CMD ["node", "dist/main.js"]

