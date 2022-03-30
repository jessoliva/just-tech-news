// This file will contain all of the user-facing routes, such as the homepage and login page

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // This route now has access to our user's session
    console.log(req.session);

    Post.findAll({
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
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // to serialize data of the sequelize object to only properties you need
        // This will loop over and map each Sequelize object into a serialized version of itself, saving the results in a new posts array
        // saves as an array 
        const posts = dbPostData.map(post => post.get({ plain: true }));

        // sending posts as an object to homepage-handlebars template so we can add other properties to the template later on
        res.render('homepage', { posts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    // passing to homepage.handlebars template. Each property becomes available in the template using the Handlebars.js {{ }} syntax.
});
// Because we've hooked up a template engine, we can now use res.render() and specify which template we want to use. In this case, we want to render the homepage.handlebars template (the .handlebars extension is implied)
// This template was light on content; it only included a single <div>. Handlebars.js will automatically feed that into the main.handlebars template, however, and respond with a complete HTML file.
// The res.render() method can accept a second argument, an object, which includes all of the data you want to pass to your template

router.get('/login', (req, res) => {

    // check for a session and redirect to the homepage if one exists
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// will deliver data to single-post.handlebars template
router.get('/post/:id', (req, res) => {

    const post = {
        id: 1,
        post_url: 'https://handlebarsjs.com/guide/',
        title: 'Handlebars Docs',
        created_at: new Date(),
        vote_count: 10,
        comments: [{}, {}],
        user: {
            username: 'test_user'
        }
    };
  
    res.render('single-post', { post });
});

module.exports = router;