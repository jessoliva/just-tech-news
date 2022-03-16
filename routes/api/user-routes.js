// create five routes that will work with the User model to perform Create Read Update Delete operations

const router = require('express').Router();
// importing exported User object from models/index.js
const { User } = require('../../models');

// These endpoints for the server are going to be accessible at the /api/users URL

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password'] }
        // client doesn't need the users password
    })
    .then(dbUserData => res.json(dbUserData)) //dbUserData is the data retrieved from the findAll() method
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// API endpoint so that when the client makes a GET request to /api/users, we will select all users from the user table in the database and send it back as JSON
// the User model inherits functionality from the Sequelize Model class
// .findAll() is one of the Model class's methods -->  lets us query all of the users from the user table in the database, and is the JavaScript equivalent of the following SQL query: SELECT * FROM users;
// we've provided an attributes key and instructed the query to exclude the password column --> It's in an array because if we want to exclude more than one, we can just add more

// GET /api/users/1
// : means whatever is written in this sxn of the url is going to be captured as part as the req.params object 
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
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

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;