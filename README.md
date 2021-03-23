# Authentication REST API

API Documentation = [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/94e28f1488fbbf63fb6e)

## Project Structures

  - **application**
    This folder save all of the application infrastructure like controller, models, routes, and middleware

    - controllers
      place for all the controller files. controllers file is the file with .controller.js suffix.

    - middlewares
      place for all the middleware files. middleware file is the file with .middleware.js suffix. middleware is used for authenticating request, checking requesting user is 
      authorize or not.
    
    - models
      place for all the mongodb models & schema

    - routes
      place for all route files
    
    - services
      place for all the service files. service/repository is an object that communicate with 
      models. with service class we can using same query/method everywhere without a model. ex: controller & middleware

  
  - **bin**
    auto generate by express generator

  - **config**
    folder for all config module file

  - **helpers**
    folder for all helpers file
