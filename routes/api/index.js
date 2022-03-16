// This file, like index.js in the models folder, will serve as a means to collect all of the API routes and package them up for us

const indexRouter = require('express').Router();
const userRoutes = require('./user-routes.js');

indexRouter.use('/users', userRoutes);
// in user-routes.js we didn't use the word users in any routes because in this file we take those routes and implement them to another router instance, prefixing them with the path /users at that time

module.exports = indexRouter;