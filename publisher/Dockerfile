FROM node:16-alpine3.11

WORKDIR /app
COPY package*.json ./ 
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "watch"]
