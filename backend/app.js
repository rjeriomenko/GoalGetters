const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug');

const cors = require('cors');
const csurf = require('csurf');
const { isProduction } = require('./config/keys');

require('./models/User');
require('./models/ExerciseEntry');
require('./models/Goal');
require('./models/Exercise');
require('./models/Follow');
require('./config/passport');
const passport = require('passport');

const usersRouter = require('./routes/api/users');
const csrfRouter = require('./routes/api/csrf');
const feedRouter = require('./routes/api/feed');
const exercisesRouter = require('./routes/api/exercises');
const goalsRouter = require('./routes/api/goals');
const exerciseEntriesRouter = require('./routes/api/exerciseEntries');
const followsRouter = require('./routes/api/follows');

const app = express();

app.use(logger('dev')); // log request components (URL/method) to terminal
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: false })); // parse urlencoded request body
app.use(cookieParser()); // parse cookies as an object on req.cookies

if (!isProduction) {
    app.use(cors());
}

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// Attach Express routers
app.use('/api/users', usersRouter);
app.use('/api/csrf', csrfRouter);
app.use('/api/feed', feedRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/exerciseEntries', exerciseEntriesRouter);
app.use('/api/follows', followsRouter);
app.use(passport.initialize()); //*

if (isProduction) {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    app.get('/', (req, res) => {
        res.cookie('CSRF-TOKEN', req.csrfToken());
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'build', 'index.html')
        );
    });

    // Serve the static assets in the frontend's build folder
    app.use(express.static(path.resolve("../frontend/build")));

    // Serve the frontend's index.html file at all other routes NOT starting with /api
    app.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('CSRF-TOKEN', req.csrfToken());
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'build', 'index.html')
        );
    });
}

// Express custom middleware for catching all unmatched requests and formatting
// a 404 error to be sent as the response.
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug('backend:error');

// Express custom error handler that will be called whenever a route handler or
// middleware throws an error or invokes the `next` function with a truthy value
app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
});

module.exports = app;