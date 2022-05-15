const router = require('express').Router();
const usersRoute = require('./users');
const thoughtsRoute = require('./thoughts');

router.use('/users', usersRoute);
router.use('/thoughts', thoughtsRoute);

module.exports = router;