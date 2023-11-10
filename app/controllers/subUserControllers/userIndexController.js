const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;

const logger = require('../../../modules/logger');

const User = require('../../models/userModel');

/**
 * @function [users/] (get) index list all users (soft deleted excluded)
 * ---
 * @param {*} req none
 * @param {*} res list of users
 * ---
 * admin sees soft deleted users
 */
const index = async (req, res) => {
    try {
        const users = await User.find(isAdmin(req));

        const clean = users.map((user) => {
            return {
                id: user._id,
                username: user.username,
                role: user.role,
                created: user.created,
                profile: {
                    path: `${url}:${port}/users/${user._id}`,
                    method: 'GET',
                },
            };
        });
        logger.info(`list users ${clean}`);

        res.status(200).json({
            status: 'success',
            message: clean,
        });
    } catch (err) {
        logger.error(`listing users error ${err}`);

        res.status(404).json({
            status: 'error',
            message: `error fetching users`,
        });
    }
};

/**
 * @function isAdmin check if the user is admin
 * ---
 * @param {Object} req checks session role
 * @param {Boolean} bool default false
 * ---
 * if bool is set to true returns only true or false
 */
const isAdmin = (req, bool = false) => {
    const admin = req.session.user.role == 'admin';

    logger.warning(`is admin ${admin}`);

    if (admin) {
        return !bool ? {} : true;
    } else {
        return !bool ? { 'deleted.at': { $exists: false } } : false;
    }
};

module.exports = { index };
