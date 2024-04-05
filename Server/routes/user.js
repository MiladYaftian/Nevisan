const express = require('express');
const router = express.Router();
const {auth} = require('../utils/middleware');
const {getUser, setUserAvatar, removeUserAvatar} = require('../controllers/user');

//User Routes
router.get('/:username', getUser);
router.post('/avatar', auth, setUserAvatar);
router.delete('/avatar', auth, removeUserAvatar);


module.exports = router;