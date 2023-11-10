const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;

const bcrypt = require('bcrypt');
const logger = require('../../../modules/logger');

const User = require('../../models/userModel');

/**
 * @function [users/:id] (patch) update user by id (soft deleted can be edited by admin)
 * ---
 * @param {*} req user id param and data in body to be updated
 * @param {*} res shows updated user
 * ---
 * user can only update it self,
 * mod can update any user with exception of admin
 * role can only be updated by admin
 */
const update = async (req, res) => {
    const id = req.params.id;
    const activeUser = req.session.user;

    logger.info(`data to update ${req.body}`);

    const userToEdit = await User.findOne({ c_id: id });

    if (userToEdit != null && userToEdit.deleted.at == null) {
        logger.error(`user ${id} not found`);
        return res.status(404).send({
            status: 'error',
            message: `user ${id} not found`,
        });
    }

    logger.info(`user to update ${userToEdit}`);

    switch (activeUser.role) {
        case 'user':
            if (activeUser.id != id || req.body.role) {
                res.status(403).json({
                    status: 'error',
                    message: 'you can only edit yourself, you can not change your role',
                });
            } else {
                updateUser();
            }
            break;
        case 'mod':
            if ((userToEdit != null && userToEdit.role == 'admin') || req.body.role) {
                res.status(403).json({
                    status: 'error',
                    message: 'you can not edit admin users, you can not change user roles',
                });
            } else {
                updateUser();
            }
            break;
        case 'admin':
            updateUser();
            break;
        default:
            res.status(500).json({
                status: 'error',
                message: 'something went very wrong',
                contact: 'suport@example.com',
            });
            break;
    }

    function updateUser() {
        const password = req.body.password;

        bcrypt.hash(password, 10, async (err, hash) => {
            const updatedUser = User.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        username: req.body.username,
                        password: hash,
                        role: req.body.role,
                        edited: {
                            at: Date.now(),
                            by: activeUser.id,
                        },
                    },
                },
                (err, result) => {
                    if (err) {
                        let msg;

                        if (err.code === 11000) msg = 'user already exists';
                        else msg = err.errors.username.message;

                        logger.error(`updating user error ${err}`);

                        res.status(400).json({
                            status: 'error',
                            message: msg,
                        });
                    } else if (result) {
                        logger.info(`updated user to ${updatedUser}`);

                        res.status(200).json({
                            status: 'success',
                            message: `user updated [${result.username}] successfully`,
                            options: {
                                profile: {
                                    path: `${url}:${port}/users/${result._id}`,
                                    method: 'GET',
                                },
                            },
                        });
                    }
                }
            );
        });
    }
};

module.exports = { update };
