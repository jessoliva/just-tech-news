const postRouter = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote, Comment } = require('../../models');
// included Post model because In a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model

// get all posts /api/posts
postRouter.get('/', (req, res) => {

    console.log('======================');

    Post.findAll({ // this is the query
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [ // include queries
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                } // include the User model itself so it can attach the username to the comment
            },
            {
                model: User,
                attributes: ['username']
            }
            //  the three include properties translated into three LEFT OUTER JOIN statements. One joins post with comment, another post with user, and then comment with user
        ]
        // the include property is expressed as an array of objects
        // same as JOIN in sql
        // this will display which user created which posts
        // the username attribute was nested in the user object, which designates the table where this attribute is coming from
    })
    // this is the Promise that captures the response from the database call
    // database call is the findAll and what is returned
    .then(dbPostData => res.json(dbPostData)) 
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// the order property is assigned a nested array that orders by the created_at column in descending order. This will ensure that the latest posted articles will appear first.

// get a single post
postRouter.get('/:id', (req, res) => {

    // use of the req.params to retrieve the id property from the route
    // used the where property to set the value of the id using req.params.id
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                } // include the User model itself so it can attach the username to the comment
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            // The 404 status code identifies a user error and will need a different request for a successful response
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a post!
postRouter.post('/', (req, res) => {

    // using req.body to populate the columns in the post table
    // everything on the left are the column names
    // everything on the right are the values based on user input/interface
    // same as INSERT INTO post table
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    }); 
});

// When we vote on a post, we're technically updating that post's data. This means that we should create a PUT route for updating a post
// PUT /api/posts/upvote
postRouter.put('/upvote', (req, res) => {

    // make sure the session exists first
    if (req.session.loggedIn) {

        // pass session id along with all destructured properties on req.body
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
        // custom upvote static method created in models/Post.js
    }
});
// Make sure this PUT route is defined before the /:id PUT route, though. Otherwise, Express.js will think the word "upvote" is a valid parameter for /:id

// update title of a post
postRouter.put('/:id', (req, res) => {

    Post.update(
        { // used the req.body.title value to replace the title of the post
            title: req.body.title
        },
        {
            where: { // used the request parameter to find the post,
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        // In the response, we sent back data that has been modified and stored in the database.
        res.json(dbPostData);
        // response will be # of rows changed in the last query
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete a post
postRouter.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        // will display how many rows were affected
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// The id once used is never reused in favor of a new number. This is to avoid any possible references to other tables.

module.exports = postRouter;