const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModelSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            index: true,
            unique: [true, 'username already registered'],
            trim: true,
            minLength: [4, 'username is too short'],
            maxLength: [16, 'username is too long'],
            validate: {
                validator: function (us) {
                    return /[a-zA-Z0-9]{4,16}/.test(us);
                },
                message: 'invalid username',
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: false,
            trim: true,
            default: 'user',
        },
        created: {
            type: Date,
            required: true,
            default: Date.now,
        },
        edited: [
            {
                _id: false,
                at: {
                    type: Date,
                    required: true,
                },
                by: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
            },
        ],
        deleted: [
            {
                _id: false,
                at: {
                    type: Date,
                    required: true,
                },
                by: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
            },
        ],
    },
    {
        collection: 'users',
    }
);

/**
 * @model User model
 * ---
 * @param {String} username length min 4, max 16, alphanumeric, uppercase or lowercase
 * @param {String} password hashed with bcrypt
 * @param {String} role default is user
 * @param {String} created date auto assigned on creation
 * @param {Array} edited [at, by]
 * @param {String} at date auto assigned on editing
 * @param {String} by user ObjectId
 * @param {Array} deleted [at, by]
 * @param {String} at date auto assigned on soft deletion
 * @param {String} by user ObjectId
 * ---
 * description each user has it's own document
 * edited array (sub document) should be filled on editing users documents
 * deletion is soft unless done by an admin with hard key
 */
const User = mongoose.model('User', UserModelSchema);
module.exports = User;
