const { Model, DataTypes } = require('sequelize');
// connection to MySQL we stored in the connection.js
const sequelize = require('../config/connection');

// create(define) our Post model
class Post extends Model {}

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