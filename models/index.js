// collect and export the models data and export it as an object with it as a property
// relationship between the User and the Post model
	// A user can make many posts. But a post only belongs to a single user, and never many users. 
    // By this relationship definition, we know we have a one-to-many relationship
    // define this relationship in the index.js file in the models folder
// to implement these associations, need to drop/create tables again since associations were just created --> checker sequelize.sync in server.js
const User = require('./User');
const Post = require('./Post');

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


module.exports = { User, Post };

// User --> primary key id
// Post --> foreign key (user_id) references user(id)