const index = require('./subUserControllers/userIndexController').index;
const read = require('./subUserControllers/userReadController').read;
const update = require('./subUserControllers/userUpdateController').update;
const create = require('./subUserControllers/userCreateController').create;
const remove = require('./subUserControllers/userRemoveController').remove;

/**
 * functions moved to subUserControllers for sanity sake
 */
module.exports = {
    index,
    read,
    update,
    remove,
    create,
};
