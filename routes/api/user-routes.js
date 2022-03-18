// create five routes that will work with the User model to perform Create Read Update Delete operations

const userRouter = require('express').Router();
// importing exported User object from models/index.js
const { User } = require('../../models');

// These endpoints for the server are going to be accessible at the /api/users URL

// GET /api/users
userRouter.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password'] }
        // client doesn't need the users password
    })
    .then(dbUserData => res.json(dbUserData)) //dbUserData is the data retrieved from the findAll() method
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
        // The 500 Internal Server Error is a "server-side" error, meaning the problem is not with your PC or Internet connection but instead is a problem with the web site's server
    });
});
// API endpoint so that when the client makes a GET request to /api/users, we will select all users from the user table in the database and send it back as JSON
// the User model inherits functionality from the Sequelize Model class
// .findAll() is one of the Model class's methods -->  lets us query all of the users from the user table in the database, and is the JavaScript equivalent of the following SQL query: SELECT * FROM users;
// we've provided an attributes key and instructed the query to exclude the password column --> It's in an array because if we want to exclude more than one, we can just add more

// GET /api/users/1
// : means whatever is written in this sxn of the url is going to be captured as part as the req.params object 
userRouter.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: { // where = object
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        // else return the user
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// findOne() = variation of the .findAll() method
// also, we're actually passing an argument into the .findOne() method, another great benefit of using Sequelize
// we're using the where option to indicate we want to find a user where its id value equals whatever req.params.id is, much like the following SQL query: SELECT * FROM users WHERE id = 1
// Because we're looking for one user, there's the possibility that we could accidentally search for a user with a nonexistent id value. Therefore, if the .then() method returns nothing from the query, we send a 404 status back to the client to indicate everything's okay and they just asked for the wrong piece of data

// POST /api/users
userRouter.post('/', (req, res) => {

    // there's a hook for beforeCreate
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
        // comes from the form submitting this data
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// To insert data, we can use Sequelize's .create() method
// Pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from req.body

// verify user's identity
// route will be found at http://localhost:3001/api/users/login
userRouter.post('/login', (req, res) => {

    // first step will be to find the instance of a user that contains the user's credentials
    // .findOne() Sequelize method looks for a user with the specified email saved as req.body.email
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => { // The result of the query is passed as dbUserData to the .then() part of the .findOne() method
        // if the user with that email was not found, a message is sent back as a response to the client
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        // if the user's email is in the database, this instance of a user must be returned in a Promise so we can proceed with the password verification process
        // if the email was found in the database, the next step will be to verify the user's identity by matching the password from the user and the hashed password in the database. This will be done in the Promise of the query
        // user is returned in a Promise 
        // res.json({ user: dbUserData });

        // If the query result is successful (i.e., not empty), we can call .checkPassword(), which will be on the dbUserData object
        // We'll need to pass the plaintext password, which is stored in req.body.password, into .checkPassword() as the argument
        // The .compareSync() method, which is inside the .checkPassword() method, can then confirm or deny that the supplied password matches the hashed password stored on the object
        // .checkPassword() will then return true on success or false on failure. We'll store that boolean value to the variable validPassword

        // verify use
        // the instance method (checkPassword) was called on the user retrieved from the database, dbUserData
        const validPassword = dbUserData.checkPassword(req.body.password);

        // Because the instance method returns a Boolean, we can use it in a conditional statement to verify whether the user has been verified or not
        // if the match returns a false value, an error message is sent back to the client, and the return statement exits out of the function immediately
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        
        // However, if there is a match, the conditional statement block is ignored, and a response with the data and the message "You are now logged in." is sent instead.
        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
})
//In this case, a login route could've used the GET method since it doesn't actually create or insert anything into the database. But there is a reason why a POST is the standard for the login that's in process. A GET method carries the request parameter appended in the URL string, whereas a POST method carries the request parameter in req.body, which makes it a more secure way of transferring data from the client to the server. Remember, the password is still in plaintext, which makes this transmission process a vulnerable link in the chain
// We queried the User table using the findOne() method for the email entered by the user and assigned it to req.body.email

// PUT /api/users/1
userRouter.put('/:id', (req, res) => {
    
    // there's a hook for beforeUpdate
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        // Will select all records that are about to be updated and emit before- + after- Update on each instance
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// To update existing data, use both req.body --> creating data and req.params --> req.params.id = looking up data
// .update() method combines the parameters for creating data and looking up data
// We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used

// DELETE /api/users/1
userRouter.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// To delete data, use the .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table --> req.params.id

module.exports = userRouter;