const express = require('express');
const favicon = require('serve-favicon');
const session = require('express-session');

const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;

const logger = require('../modules/logger');
const router = require('./router/router');

const timer = 1000 * 60 * 60 * 12; // 12 hours
const secret = process.env.SECRET_KEY;

/**
 * initializes express server
 */
const app = express();

app.use(express.json());

app.use(
    session({
        secret: secret,
        saveUninitialized: true,
        cookie: { maxAge: timer },
        resave: false,
        name: 'cookie',
    })
);

app.use(favicon('./public/images/favicon.ico'));

app.use((req, res, next) => {
    logger.info(`request at [${req.path}]`);
    next();
});

/**
 * API root checks for session
 * shows message according to session status
 */
app.get('/', (req, res) => {
    if (req.session.user) {
        res.status(200).json({
            status: 'success',
            message: `active user session [${req.session.user.username}] found`,
            options: {
                users: {
                    path: `${url}:${port}/users`,
                    method: 'GET',
                },
                logout: {
                    path: `${url}:${port}/auth/logout`,
                    method: 'POST',
                },
            },
        });
    } else {
        res.status(200).json({
            status: 'success',
            message: 'welcome to repos-api',
            options: {
                login: {
                    path: `${url}:${port}/auth/login`,
                    method: 'POST',
                    body: {
                        username: 'username',
                        password: 'password',
                    },
                },
            },
        });
    }
});

// load router paths
app.use('/', router);

// log all request routes
app.listen(port, () => {
    logger.info(`server running at [${url}:${port}]`);
});

module.exports = app;
