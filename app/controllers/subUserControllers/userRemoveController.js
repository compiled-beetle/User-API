const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;
const hardKey = process.env.HARD_KEY;

const logger = require('../../../modules/logger');

const User = require('../../models/userModel');

/**
 * @function [users/:id] (delete) delete user
 * ---
 * @param {*} req user id param and hard key in body for hard delete
 * @param {*} res shows deleted user id
 * ---
 * only admin can hard delete users (hard key required)
 */
const remove = async (req, res, next) => {
    const id = req.params.id;
    const activeUser = req.session.user;

    const userToDelete = await User.findOne({ _id: id });

    if (userToDelete != null && userToDelete.deleted.at == null) {
        logger.error(`user ${id} not found`);
        return res.status(404).send({
            status: 'error',
            message: `user ${id} not found`,
        });
    }

    logger.info(`user to delete ${userToDelete}`);

    switch (activeUser.role) {
        case 'user':
            if (activeUser.id != id) {
                res.status(403).json({
                    status: 'error',
                    message: 'you can only delete yourself',
                });
            } else {
                updateUser();
            }
            break;
        case 'mod':
            if (userToDelete != null && userToDelete.role == 'admin') {
                res.status(403).json({
                    status: 'error',
                    message: 'you can not delete admin users',
                });
            } else {
                updateUser();
            }
            break;
        case 'admin':
            if (req.body.key == hardKey) {
                const hardDelete = User.findOneAndDelete(id, (err, result) => {
                    if (err) {
                        logger.error(`deleting error ${err}`);
                        res.status(404).json({
                            status: 'error',
                            message: 'user could not be deleted',
                        });
                    } else if (result) {
                        res.status(200).json({
                            status: 'success',
                            message: `user [${result.username}] deleted successfully`,
                        });
                    }
                });
            } else {
                updateUser();
            }
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
        const deletedUser = User.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    deleted: {
                        at: Date.now(),
                        by: activeUser.id,
                    },
                },
            },
            (err, result) => {
                if (err) {
                    logger.error(`deleting user error ${err}`);

                    res.status(404).json({
                        status: 'error',
                        message: 'user could not be deleted',
                    });
                } else if (result) {
                    logger.info(`deleted user to ${deletedUser}`);

                    res.status(200).json({
                        status: 'success',
                        message: `user [${result.username}] deleted successfully`,
                        options: {
                            users: {
                                path: `${url}:${port}/users`,
                                method: 'GET',
                            },
                        },
                    });
                }
            }
        );
    }
};

module.exports = { remove };
