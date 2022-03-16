// purpose of this file is to collect the packaged API routes that were packed in the routes/api/index.js file
// Now when we import the routes to server.js, they'll already be packaged and ready to go with this one file! 

const indexRouter = require('express').Router();
// references routes/api/index.js files
const apiRoutes = require('./api');

indexRouter.use('/api', apiRoutes);
// in user-routes.js (and in routes/api/index.js) we didn't use the word api in any routes because in this file we take those routes and implement them to another router instance, prefixing them with the path /api at that time
//  here we are collecting the packaged group of API endpoints and prefixing them with the path /api

indexRouter.use((req, res) => {
    res.status(404).end();
});
// This is so if we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating we have requested an incorrect resource, another RESTful API practice

module.exports = indexRouter;