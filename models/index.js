// collect and export the models data and export it as an object with it as a property
// relationship between the User and the Post model
	// A user can make many posts. But a post only belongs to a single user, and never many users
    // By this relationship definition, we know we have a one-to-many relationship
    // define this relationship in the index.js file in the models folder
// to implement these associations, need to drop/create tables again since associations were just created --> checker sequelize.sync in server.js
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// CREATING STANDARD RELATIONSHIPS!!!
    // To create a One-To-One relationship, the hasOne and belongsTo associations are used together;
    // To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
    // To create a Many-To-Many relationship, two belongsToMany calls are used together.


// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
}); 
// hasMany = One-To-Many relationship exists btw User and Post
    // user = source model and post = target model
    // the foreign key being defined in the target model Post

// This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model
// creates 1 to 1 relationship, bc a post can only belong to 1 user
Post.belongsTo(User, { 
    foreignKey: 'user_id',
});
// belongsTo = One-To-One relationship
    // post = source model and user = target model
    // foreign key being defined in the source model Post
// we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model

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
//belongsToMany needs the through: property
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});
// Many-to-Many relationships

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

// Comment Model Associations
// Note that we don't have to specify Comment as a through table like we did for Vote. This is because we don't need to access Post through Comment; we just want to see the user's comment and which post it was for. Thus, the query will be slightly different.
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };

// User --> primary key id
// Post --> foreign key (user_id) references user(id)