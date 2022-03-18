// installed dependencies: npm install express sequelize mysql2

const express = require('express');
// references routes/index.js file!
const routes = require('./routes');
// importing the connection to Sequelize from config/connection.js. Then, at the bottom of the file, we use the sequelize.sync() method to establish the connection to the database
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);
// Since we set up the routes the way we did, we don't have to worry about importing multiple files for different endpoints. The router instance in routes/index.js collected everything for us and packaged them up for server.js to use

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening in ${PORT}`));
});
// The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables
// f it doesn't find a table, it'll create it for you!
// The other thing to notice is the use of {force: false} in the .sync() method. This doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup. This is great for when we make changes to the Sequelize models, as the database would need a way to understand that something has changed.
// changed force:false to force true
    // If we change the value of the force property to true, then the database connection must sync with the model definitions and associations
    // By forcing the sync method to true, we will make the tables re-create if there are any association changes
    // association changes made for User and Post
    // This definition performs similarly to DROP TABLE IF EXISTS, which was used previously. This allows the table to be overwritten and re-created
    // We only want to drop the tables so the application can re-create them and implement the associations
// ONCE TABLES ARE DROPPED --> change back to force: false --> to prevent constantly dropping all entries/seed data we enter when the app restarts