// installed dependencies: npm install express sequelize mysql2 express-handlebars express-session connect-session-sequelize bcrypt dotenv


// express
const express = require('express');
const routes = require('./controllers'); // references routes/index.js file!
const path = require('path');

// sequelize
// importing the connection to Sequelize from config/connection.js. Then, at the bottom of the file, we use the sequelize.sync() method to establish the connection to the database
const sequelize = require('./config/connection');

const app = express();
// This uses Heroku's process.env.PORT value when deployed and 3001 when run locally
const PORT = process.env.PORT || 3001;
// for heroku: murmuring-tundra-83143
// Having a dynamic port number is important, because it is very unlikely that the port number you hardcode (e.g., 3001) would be the port Heroku runs your app on

// express-handlebars
const exphbs = require('express-handlebars');
// pass the helpers to the existing exphbs.create() statement 
const hbs = exphbs.create({ helpers });

// Sessions allow our Express.js server to keep track of which user is making a request, and store useful data about them in memory
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {}, // this is all we need to do tell our session to use cookies
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));
//
// This code sets up an Express.js session and connects the session to our Sequelize database.

// express-handlebars engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use static files in public folder
app.use(express.static(path.join(__dirname, 'public')));
// The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. This is useful for front-end specific files like images, style sheets, and JavaScript files

// turn on routes
app.use(routes);
// Since we set up the routes the way we did, we don't have to worry about importing multiple files for different endpoints. The router instance in routes/index.js collected everything for us and packaged them up for server.js to use


// turn on connection to db and server
sequelize.sync({ force: false }).then(() => { // switch back and forth btw true and false - true when you need to drop db, false when that has happened already
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