const { Model, DataTypes } = require('sequelize');
// connection to MySQL we stored in the connection.js
const sequelize = require('../config/connection');

// create(define) our Post model
class Post extends Model {
    // adding a class level method
    // Here, we're using JavaScript's built-in static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method like we used earlier with the User model.
    // We've set it up so that we can now execute Post.upvote() as if it were one of Sequelize's other built-in methods. With this upvote method, we'll pass in the value of req.body (as body) and an object of the models (as models) as parameters
    // we're using models.Vote instead, and we'll pass the Vote model in as an argument from post-routes.js
    static upvote(body, models) {

        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        })
        .then(() => {
            // then find the post we just voted on
            // So when we vote on a post, we'll see that post—and its updated vote total—in the response
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ] // .literal() allows us to run regular SQL queries from within the Sequelize method-based queries
                ]
            });
        });
    }
}

// create fields/columns for Post model
Post.init(
    { // in this first parameter for the Post.init function, we define the Post schema
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { // we ensure that this url is a verified link by setting the isURL property to true
                isURL: true
            }
        },
        user_id: { // used to create a relationship between user table and post table
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
        // this column determines who posted the news article
        // Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key
        // The user_id is conversely defined as the foreign key in the Post table and will be the matching link
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true, // column names to have an underscore naming convention
        modelName: 'post'
    }
);

module.exports = Post;