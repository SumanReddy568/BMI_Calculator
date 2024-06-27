FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
RUN npm install http-proxy-middleware@latest

COPY . .

RUN npm run build

CMD ["npm", "start"]