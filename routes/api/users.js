const router = require('express').Router();

router.route('/').get(getUsers).post(createUser);