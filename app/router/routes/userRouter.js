const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const { index, read, update, remove, create } = require('../../controllers/userController');

router.route('/').get(auth, index).post(create);

router.route('/:id').get(auth, read);

router.route('/:id').patch(auth, update).delete(auth, remove);

module.exports = router;
