// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();
// we don't have to save the require('dotenv') to a variable. All we need it to do here is execute when we use connection.js and all of the data in the .env file will be made available at process.env.<ENVIRONMENT-VARIABLE-NAME>.

// create connection to our database, pass in your MySQL information for username and password
let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} 
else {
    // changed parameters from 'just_tech_news_db', 'username', 'password', 
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}
// When the app is deployed, it will have access to Heroku's process.env.JAWSDB_URL variable and use that value to connect. Otherwise, it will continue using the localhost configuration

module.exports = sequelize;

// All we're doing here is importing the base Sequelize class and using it to create a new connection to the database. The new Sequelize() function accepts the database name, MySQL username, and MySQL password (respectively) as parameters, then we also pass configuration settings. Once we're done, we simply export the connection