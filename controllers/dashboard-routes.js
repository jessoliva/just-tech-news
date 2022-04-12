const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
// using it in line 8 instead of in the callback function duh
const withAuth = require('../utils/auth');

// display user posts
router.get('/', withAuth, (req, res) => {
// Take a moment to visualize the order here. When withAuth() calls next(), it will call the next (anonymous) function. However, if withAuth() calls res.redirect(), there is no need for the next function to be called, because the response has already been sent.

    Post.findAll({
        where: {
          // use the ID from the session
          user_id: req.session.user_id
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
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
    .then(dbPostData => {
        // serialize data before passing to template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // We'll hardcode the loggedIn property as true on this route, because a user won't even be able to get to the dashboard page unless they're logged in
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findByPk(req.params.id, {
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
    if (dbPostData) {
        const post = dbPostData.get({ plain: true });
        
        res.render('edit-post', {
        post,
        loggedIn: true
        });
    } else {
        res.status(404).end();
    }
    })
    .catch(err => {
    res.status(500).json(err);
    });
  });

module.exports = router;