// this is thr through table 
// sole purpose of connecting the data between two other tables with their primary keys --> User and Post tables
    // primary keys are user_id and post_id

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { // used to create a relationship between user table and post table
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        } // holds primary key value of a user
    },
    post_id: { // used to create a relationship between user table and post table
        type: DataTypes.INTEGER,
        references: {
            model: 'post',
            key: 'id'
        } // holds primary key value of a post
    }
    // Now, with these columns in place, we can track the posts that users vote on
    // When a user votes on a post, we'll insert a new row of data to the table, which lists the primary key of the user and the primary key of the post they voted on
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'vote'
  }
);

module.exports = Vote;