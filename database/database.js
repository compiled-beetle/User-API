const logger = require('../modules/logger');

const mongoose = require('mongoose');

const db_user = `${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}`;
const db_host = `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`;
const db_name = process.env.DATABASE_NAME;
const connection = `mongodb://${db_user}@${db_host}/${db_name}?authMechanism=DEFAULT&authSource=admin`;

mongoose.connect(connection);

/**
 * initializes connection to database
 */
const database = mongoose.connection
    .on('error', (error) => {
        logger.error(`database connection error [${error}]`);
    })
    .once('connected', () => {
        logger.info(`database connection on [${connection}]`);
    });

module.exports = database;
