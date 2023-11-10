const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;

const logger = require('../../../modules/logger');

const User = require('../../models/userModel');

/**
 * @function [users/:id] (get) show user by id (exclude soft deleted)
 * ---
 * @param {*} req user id param
 * @param {*} res show user data
 * ---
 * admin sees soft deleted users
 */
const read = async (req, res) => {
    const id = req.params.id;

    try {
        const roleAdmin = req.session.user.role == 'admin';

        logger.warning(`session role is admin ${roleAdmin}`);

        let user;

        if (roleAdmin === false) {
            user = await User.findOne({
                _id: id,
                'deleted.at': { $exists: false },
            });
        } else {
            user = await User.findById({ _id: id });
        }

        const clean = {
            id: user._id,
            username: user.username,
            role: user.role,
            created: user.created,
            profile: {
                path: `${url}:${port}/users/${user._id}`,
                method: 'GET',
            },
            options: {
                edit: {
                    path: `${url}:${port}/users/${user._id}`,
                    method: 'PATCH',
                    required: {
                        body: {
                            field: 'new data',
                            '...': '...',
                        },
                        notes: 'not all fields can be edited',
                    },
                },
                remove: {
                    path: `${url}:${port}/users/${user._id}`,
                    method: 'DELETE',
                },
            },
        };

        logger.info(`read user ${user}`);

        res.status(200).json({
            status: 'success',
            message: clean,
        });
    } catch (err) {
        logger.error(`reading user error ${err}`);

        res.status(404).json({
            status: 'error',
            message: 'user could not be found',
        });
    }
};

module.exports = { read };
