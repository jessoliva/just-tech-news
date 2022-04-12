const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

// get at api/comments
router.get('/', (req, res) => {

    Comment.findAll({
        attribute: [
            'id',
            'comment_text',
            'created_at',
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
              model: User,
              attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData)) 
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

router.post('/', withAuth, (req, res) => {
    // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
    // check the session to check if a user is logged in
    if (req.session.loggedIn) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            // use the id from the session
            user_id: req.session.user_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }

});

router.delete('/:id', withAuth, (req, res) => {

    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No comment found with this id' });
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

module.exports = router;