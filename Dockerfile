# specify the node base image with your desired version node:<version>
FROM node:18-alpine

ARG NODE_ENV=production

WORKDIR /usr/src/app


COPY . .

RUN npm ci

EXPOSE 3000

# Start cron service and your application
CMD npm start
