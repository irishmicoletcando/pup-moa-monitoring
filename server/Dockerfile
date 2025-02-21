FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install && npm install nodemailer

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]