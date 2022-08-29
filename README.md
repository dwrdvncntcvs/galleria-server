# Galleria API

<i><b>Galleria</b></i> is social media application project where users could post images and texts to share with other people that have an account on the application. The application also has followers and following where it limits the posts that the users will see on their feed.

This project was written from scratch using JavaScript, NodeJS, Sequelize, Express, Firebase, and other libraries. I used Firebase Storage to store files on the cloud instead of storing locally. The purpose of this application is for learning new practices, technologies, and techniques on creating social media applications. The project doesn't use any external APIs to fetch data and serve to the user. The application will only depend on the data that's coming to it.

## Installation

- Be sure to have [NodeJs](https://nodejs.org/) installed on your local machine.
- Clone the repository to your local machine.
  ```bash
  git clone https://github.com/dwrdvncntcvs/galleria-server.git
  ```
- Open the directory on your terminal and run the following commands:

  ```bash
  npm install
  ```

  or

  ```bash
  yarn
  ```

- Create a environment file on the src directory.

  ```bash
  touch .env
  ```

- Copy and paste these variables inside your <i><b>.env</b></i> file:

     
      DATABASE_USERNAME=
      DATABASE_PASSWORD=
      DATABASE_HOST=
      DATABASE_NAME=
      DATABASE_DIALECT=

      ACCESS_TOKEN_SECRET=
      REFRESH_TOKEN_SECRET=

      FIRE_API_KEY=
      FIRE_AUTH_DOMAIN=
      FIRE_PROJECT_ID=
      FIRE_STORAGE_BUCKET=
      FIRE_MESSAGING_SENDER_ID=
      FIRE_APP_ID=1:

      M_S_TYPE=memory
     

    - For the database configuration, it will depend on the database installed on your local machine. For this project, it is advised that you use PostgreSQL as the dependecies that support this database were already installed.

    - Access token and refresh token secret where manually generated using md5 hashing. On this [website](https://www.md5hashgenerator.com/) you could generate your own secret tokens.

    - To create firebase own configuration, you can use this [Firebase documentation](https://firebase.google.com/docs) as reference. You can also create a project at the [Firebase website](https://firebase.google.com/) and copy the configuration.

  <i><b>Note</b> : If you were creating a project on your firebase, create a storage on the project immediately. </i>

  <i><b>Note</b>: If you want to use my firebase storage, just [email](https://mail.google.com/mail/u/0/#inbox?compose=CllgCJqVNSgchFtjqSwlvjMJRJRXJTDlbglSnQWDzkWsMXtHGXrjnwncdbhRHKtTNFgpXrLLLLB) me.</i>

  <i><b>Note</b> : These are the environment variables that I used for the project. Before running the application on your local machine, please be advised that all of these are very important variables and should be configured accordingly.</i>

- Assuming that you are using <i><b>[NPM](https://www.npmjs.com/)</b></i>, to start the application, run these commands in the terminal:

  > To create database.

  ```bash
  npm run create
  ```

  > To migrate models.

  ```bash
  npm run migrate
  ```

  > To start the application

  ```bash
  npm run start
  ```

  <i><b>Note</b>: If there's any error that you are facing on running these commands, please check carefully your environment variables related to the database.</i>

- Optional Commands:

  > To undo previews migration.

  ```bash
  npm run undo
  ```

  > To undo all migrations.

  ```bash
   npm run undo:all
  ```

  > To create new model.

  ```bash
  npm run model -- -name ... -attributes ...
  ```

## Galleria's RESTFul API

This is the backend application of Galleria where it will be deployed on server side. The application is written in JavaScript with its run-time environment [NodeJs](https://nodejs.org/). The application was created using [ExpressJS](https://expressjs.com/) which is a nodejs web framework and could be used for creating RESTful APIs. The database used was PostgreSQL during development but could be altered because I have used [Sequelize](https://sequelize.org/) which is a ORM or Object-Relational Mapping. It allows me to easily create models and migrate it to the database without using SQL queries manually.
