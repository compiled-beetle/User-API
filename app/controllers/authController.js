const bcrypt = require('bcrypt');
const logger = require('../../modules/logger');

const User = require('../models/userModel');

/**
 * @function [auth/login] (post) login and create session cookie
 * ---
 * @param {*} req [username, password]
 * @param {*} res shows user sucess message
 * ---
 * soft deleted can't login
 */
const login = async (req, res) => {
    if (req.session.user) {
        logger.warning(`previous session destroyed [${req.session.user.username}]`);

        req.session.user = {};
    }

    if (req.body.username || req.body.password) {
        try {
            const user = await User.findOne({
                username: req.body.username,
                'deleted.at': { $exists: false },
            });

            if (!user) {
                logger.error(`invalid username [${req.body.username}]`);

                res.status(404).json({
                    status: 'error',
                    message: 'invalid username or password',
                });
            } else {
                logger.info(`user [${user.username}] pass [${user.password}]`);

                bcrypt.compare(
                    req.body.password,
                    user.password,

                    async (err, result) => {
                        if (result) {
                            req.session.user = {
                                id: user._id.toString(),
                                username: user.username,
                                role: user.role,
                            };
                            res.status(200).json({
                                status: 'success',
                                message: `user [${user.username}] authenticated`,
                            });
                        } else {
                            logger.error(`invalid password [${req.body.password}]`);

                            res.status(404).json({
                                status: 'error',
                                message: 'invalid username or password',
                            });
                        }
                    }
                );
            }
        } catch (err) {
            logger.error(`login failed [${err}]`);

            res.status(500).json({
                status: 'error',
                message: 'something went very wrong',
                contact: 'suport@example.com',
            });
        }
    } else {
        logger.error('no login data');

        res.status(401).json({
            status: 'error',
            message: 'no authentication credentials',
            expected: {
                body: {
                    username: 'username',
                    password: 'password',
                },
            },
        });
    }
};

/**
 * @function [auth/logout] (post) destroys session
 * ---
 * @param {*} req none, session must exist
 * @param {*} res logout success message
 * ---
 * maybe with redirect to [/]
 */
const logout = async (req, res) => {
    if (req.session.user) {
        logger.info(`session destroyed: [${req.session.user.username}]`);
        res.status(200).json({
            status: 'success',
            message: `user [${req.session.user.username}] session destroyed`,
        });
        req.session.destroy();
    } else {
        logger.error(`no active session`);
        res.status(400).json({
            status: 'error',
            message: 'no active session',
            options: {
                home: {
                    path: 'http://127.0.0.1:3000',
                    method: 'GET',
                },
                login: {
                    path: 'http://127.0.0.1:3000/auth/login',
                    method: 'POST',
                    body: {
                        username: 'username',
                        password: 'password',
                    },
                },
            },
        });
    }
    // res.redirect('/');
};

module.exports = {
    login,
    logout,
};
