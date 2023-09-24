const express = require('express'); // Importing the Express framework
const port = 8000; // Defining the port number
const app = express(); // Creating an Express application

// Importing express-ejs-layouts for rendering pages
const expressLayout = require('express-ejs-layouts');

// Importing the database configuration
const db = require('./config/mongoose');

const bodyParser = require('body-parser');

// Creating a session for user authentication
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local');

// Importing mongo-store for session storage
const MongoStore = require('connect-mongo');

// Importing connect-flash for displaying flash messages
const flash = require('connect-flash'); 
const flashMiddleWare = require('./config/flashMiddleware');

// Middleware for parsing incoming request data
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for serving static files from the 'assets' folder
app.use(express.static('./assets'));

// Setting the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Adding support for Express layouts
app.use(expressLayout);

// Configuring session handling
app.use(session({
    name: "ERS",
    // Change the 'secret' before deploying to production
    secret: "employeeReviewSystem",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // Session cookie max age
    },
    store: MongoStore.create({
        // MongoDB connection URL for session storage
        mongoUrl: 'mongodb+srv://whiteWolff:praduman@cluster0.an8uy3k.mongodb.net/ERS?retryWrites=true&w=majority',
        autoRemove: 'disabled'
    },
    (err) => {
        console.log(err || 'connect-mongo setup ok');
    })
}))

// Initializing Passport.js for user authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Using Connect flash for displaying flash messages
app.use(flash());
app.use(flashMiddleWare.setFlash);

// Setting up the main router, following the MVC structure.
app.use('/', require('./routes/index'));

// Starting the server on the specified port
app.listen(port, function(err){
    if(err){
        console.log("Error in running the app.");
        return ;
    }
    console.log("Server is up and running at port " + port);
});
