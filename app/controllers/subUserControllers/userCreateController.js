const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;

const bcrypt = require('bcrypt');
const logger = require('../../../modules/logger');

const User = require('../../models/userModel');

/**
 * @function [users/] (post) create new users
 * ---
 * @param {*} req [username, password] in body
 * @param {*} res created user name
 * ---
 * admin can create users with roles
 */
const create = async (req, res) => {
    let role = 'user';

    if (req.session.user) {
        const roleAllowed = req.session.user.role == 'admin';
        if (roleAllowed && req.body.role) role = req.body.role;
    }

    const password = req.body.password;

    bcrypt.hash(password, 10, async (err, hash) => {
        const user = await User.create(
            {
                username: req.body.username,
                password: hash,
                role: role,
            },
            (err, result) => {
                if (err) {
                    let msg;

                    if (err.code === 11000) msg = 'user already exists';
                    else msg = err.errors.username.message;

                    logger.error(`creating user error ${err}`);

                    res.status(400).json({
                        status: 'error',
                        message: `error creating user ${msg}`,
                    });
                } else {
                    logger.info(`created user ${req.body.username}`);

                    res.status(201).json({
                        status: 'success',
                        message: `user created [${req.body.username}] successfully`,
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
            }
        );
    });
};

module.exports = { create };
