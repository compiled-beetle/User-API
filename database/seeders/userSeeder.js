require('dotenv').config();

const bcrypt = require('bcrypt');
const logger = require('../../modules/logger');
const database = require('../database');

const User = require('../../app/models/userModel');

const users = [
    new User({
        username: 'regularUser',
        password: '!1Apassword',
    }),
    new User({
        username: 'Moderator',
        password: '?2Bpassword',
        role: 'mod',
    }),
    new User({
        username: 'apiAdmin',
        password: 'Kl1!jadmin',
        role: 'admin',
    }),
    new User({
        username: 'deletedUser',
        password: 'deletedPass',
        deleted: [
            {
                at: Date.now(),
                by: '6333634f5e0e9a6e32eb1fd0',
            },
        ],
    }),
    new User({
        username: 'userToEdit',
        password: 'editThisUser',
        deleted: [
            {
                at: Date.now(),
                by: '6333634f5e0e9a6e32eb1fd0',
            },
        ],
    }),
];

database.once('connected', () => {
    User.ensureIndexes(function (err) {
        err ? logger.error(`indexers error [${err}]`) : null;
    });

    users.forEach((u, index) => {
        bcrypt.hash(u.password, 10).then((hashed) => {
            u.password = hashed;
            u.save((err, result) => {
                index != undefined ? logger.info(`user seeded [${result}]`) : null;
                err ? logger.error(`user seeding error [${err}]`) : null;
            });
        });
    });
});
