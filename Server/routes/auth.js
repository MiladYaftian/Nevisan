const express = require('express');
const router = express.Router();
const {signupUser, loginUser} = require('../controllers/auth');
const {auth} = require('../utils/middleware');

router.post('/signup', signupUser);
router.post('/login',auth, loginUser);

module.exports = router;