// collect and export the models data and export it as an object with it as a property
// relationship between the User and the Post model
	// A user can make many posts. But a post only belongs to a single user, and never many users
    // By this relationship definition, we know we have a one-to-many relationship
    // define this relationship in the index.js file in the models folder
// to implement these associations, need to drop/create tables again since associations were just created --> checker sequelize.sync in server.js
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model
// creates 1 to 1 relationship, bc a post can only belong to 1 user
Post.belongsTo(User, { 
    foreignKey: 'user_id',
});
// we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model.

// need to instruct the User and Post models how they can query on one another through this Vote model
// we need to associate User and Post to one another in a way that when we query Post, we can see a total of how many votes a user creates
// and when we query a User, we can see all of the posts they've voted on
// With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote
// If we want to see which users voted on a single post, we can now do that
// If we want to see which posts a single user voted on, we can see that too
// We instruct the application that the User and Post models will be connected, but in this case through the Vote model
// We state what we want the foreign key to be in Vote, which aligns with the fields we set up in the model
// We also stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// If we want to see the total number of votes on a post, we need to directly connect the Post and Vote models
// By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models. In this case, we'll see a total count of votes for a single post when queried
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };

// User --> primary key id
// Post --> foreign key (user_id) references user(id)