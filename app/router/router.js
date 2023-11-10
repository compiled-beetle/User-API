const express = require('express');
const router = express.Router();

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

const routing = express();

routing.use('/users', userRouter);

routing.use('/auth', authRouter);

module.exports = routing;
