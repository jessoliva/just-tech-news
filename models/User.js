// import the Model class and DataTypes object from Sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// to hash passwords to protect them!
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    // we set it up so that a user can check if their password is correct for a login system.
    // instance method --> returns or makes use of information (i.e., properties) specific to that particular object
    // Remember that objects generated from classes are instances of the class --> each user created is an instance of this class
    // create an instance method on the User model definition to access the password property of each user instance
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
        // Using the keyword this, we can access this user's properties, including the password, which was stored as a hashed string
    }
}
// This Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has

// define table columns and configuration
User.init(
    { // TABLE COLUMN DEFINITIONS GO HERE
        // Column settings: https://sequelize.org/v5/manual/models-definition.html
        // Data types: https://sequelize.org/v5/manual/data-types.html
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false // NOT NULL
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
            // built in validator for email
            // to ensure any email data follows the pattern of an email address (i.e., <string>@<string>.<string>) so no one can give us incorrect data
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    { // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)
        // object: hooks with it's own functions
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            // async/await syntax
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },    
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);
// Once we create the User class, we use the .init() method to initialize the model's data and configuration, passing in 2 objects as arguments
// 1st object --> will define the columns and data types for those columns
// 2nd object --> it accepts configures certain options for the table
// The nested level of the object inserted is very important. Notice that the hooks property was added to the 2nd object in User.init()

// HOOK AND HASH PASSWORD  
// function that uses Promises 
    // uses promises
    // beforeCreate(userData) {
    //     return bcrypt.hash(userData.password, 10).then(newUserData => {
    //         return newUserData //newUserData is now equal to the hashed password created
    //     });
    // }
// We use the beforeCreate() hook to execute the bcrypt hash function on the plaintext password. In the bcrypt hash function, we pass in the userData object that contains the plaintext password in the password property. We also pass in a saltRound value of 10. The resulting hashed password is then passed to the Promise object as a newUserData object with a hashed password property. The return statement then exits out of the function, returning the hashed password in the newUserData function
// function that uses async/wait
// The keyword pair, async/await, works in tandem to make this async function look more like a regular synchronous function expression. The async keyword is used as a prefix to the function that contains the asynchronous function. await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property. The newUserData is then returned to the application with the hashed password. Comparing these two functions side by side, we can see that the async/await version is much easier to read with only a single newUserData variable that is input and output after the password hashing modification. Now the async function looks like a plain old JavaScript expression.

// export the newly created model so we can use it in other parts of the app
module.exports = User;

// Table Columns
// Now we've set up the User model to have four columns. If we didn't define the model to have a primaryKey option set up anywhere, Sequelize would create one for us, but it's best we explicitly define all of the data
// Each column's definition gets its own type definition, in which we use the imported Sequelize DataTypes object to define what type of data it will be