FROM node:18

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
COPY ./tsconfig.json ./
COPY ./src ./
RUN npm i

EXPOSE 3000
RUN npm run build

CMD ["npm", "run", "dev"]
