# gram2twitterbot
Bot that listens for posts on a Telegram channel and reposts to Twitter

## Local development

Docker and Node/NPM are needed for this project.

Install dependencies

```
npm i
```

## Run locally

Create a file named `docker-compose.override.yml` in the root of the project following the template from `docker-compose.override.example.yml`, then add your credentials from the Twitter Developer Portal. Your Access token and Secret should be generated with Read and Write permissions.

You should be able to run the script with the following command

```
docker compose up --build
```
