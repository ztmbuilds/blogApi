## BlogApi

A simple blog api built while learning sequelize

# Features

- Authentication
- Authorization
- Caching
- Filtering
- Sorting
- Field Limiting
- Pagination
- and many more...

## Built with

- Nodejs(version 18.18.0)
- Expressjs
- Sequelize
- PostgreSQL

## Getting Started

### Prerequisites

The tools listed below are needed to run this application:

- Node
- Npm

You can check the Node.js and npm versions by running the following commands.

### Check node.js version

`node -v`

### Check npm version

`npm -v`

## Installation

To run this API on your local machine:

- Install project dependencies by running `npm install`.

- Start the server with `npm start:dev` to run in developement environment and `npm start:prod` for production environment

## Configuration

Create a config.env file in the root directory and add the following env variables:

```bash

 NODE_ENV=
PORT=

 #Development database
DB_NAME=
DB_HOST=
DB_PASSWORD=
DB_USERNAME=
DB_PORT=

 # Test database
DB_NAME_T=
DB_HOST_T=
DB_PASSWORD_T=
DB_USERNAME_T=
DB_PORT_T=


JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

REDIS_URI=

```

NODE_ENV, PORT, DB_NAME, DB_HOST, DB_PASSWORD, DB_USERNAME and DB_PORT are compulsory for the server to run

## Run migrations

run `npx sequelize-cli db:migrate` to create the tables and associations on the database

## Run the tests

```shell
npm run test
```

All tests are written in the `__test__` directory.

## Base URL

The base URL is http://127.0.0.1:{PORT}/

## Documentation

View Postman documentation here: https://documenter.getpostman.com/view/24160587/2sA3kdBHhv
