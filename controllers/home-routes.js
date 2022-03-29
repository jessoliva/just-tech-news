// This file will contain all of the user-facing routes, such as the homepage and login page

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
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
  

        res.render('homepage', dbPostData[0].get({ plain: true }));
        // serialize the object dbPostData[0] down to only the properties you need
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

module.exports = router;