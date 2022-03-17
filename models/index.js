// collect and export the models data
// export it as an object with it as a property

const User = require('./User');
const Post = require('./Post');

module.exports = { User, Post };

// User --> primary key id
// Post --> foreign key (user_id) references user(id)