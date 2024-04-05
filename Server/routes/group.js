const express = require('express');
const router = express.Router();
const {auth} = require('../utils/middleware');
const {getAllGroups, getGroupPosts, createGroup, getTopGroups, subscribeToGroup, editGroupDescription} = require('../controllers/group');

//Group Routes
router.get('/allGroups', getAllGroups);
router.get('/top10', getTopGroups);
router.get('/:groupName', getGroupPosts)
router.post('/', auth, createGroup);
router.post('/:id/subscribe',auth, subscribeToGroup);
router.patch('/:id', auth, editGroupDescription);

module.exports = router;