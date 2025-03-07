# barcelonatips Server and API

## Introduction
Barcelonatips Server is a backend api service built with Node.js to serve the frontend application [Barcelonatips Client](https://github.com/sven-andersson-es/bcntips-client)  .

This project has been built as a final project at [IronHack WebDev Bootcamp](https://lp.ironhack.com/en/web-development/spain).

The frontend consuming this backend is built in React and using Axio for the CRUD operations.. [Read more about the frontend here.](https://github.com/sven-andersson-es/bcntips-client)  

## Function
[Barcelonatips](https://barcelonatips.netlify.app/) can be tried out on the hosted test version on Netlify. The basic idea is to provide a simple interface for sharing personal tips for Food, Coffee and Cafés suited for work plus some nice spots to visit as in "Things to do". 

The admin interface for logged in admins uses Google Places API for a quick start filling out the location data and Google Links. Then the personal touch is added with a description and the fact that the tips is selected. The individual tips are saved in the 

## Technologies
Barcelonatips Server is built using Node.js with Express server. For the DB connection and definitions of DB Schemas Mongoose is used. For the image upload endpoint Cloudinary SPA is used.

## Api documentation
[The API Routes are documented with Postman.](https://documenter.getpostman.com/view/6482213/2sAYdoE6yk) 

## Development process
The development has been undertaken as a single person project. The steps to finish the work are presented below. including both frontend and backend. For the task management and planning of features in the server application, GitHubs issues project tool has been used.

1. Hi fidelity UI designs in Figma.
1. Planning of needed DB Schemas for the MongoDB database.
1. Development of the Backend in Node builiding the needed API Routes.
1. Development of the Frontend application in React
1. In parallell with the Frontend development the Backend has been slightly modified to adapt to new requirements.

## Backlog
- Improve error handling for all CRUD operations, includes improving frontend.