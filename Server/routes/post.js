const express = require('express');
const router = express.Router();
const {auth} = require('../utils/middleware');
const { getPostAndComments, getSearchedPosts, getSubscribedPosts, updatePost, createPost, deletePost, likePost, dislikePost, likeComment, dislikeComment, likeReply, dislikeReply, postComment, deleteComment, updateComment, postReply, deleteReply, updateReply} = require('../controllers/post')

//Posts Routes
router.get('/:id/comments', getPostAndComments)
router.get('/search', getSearchedPosts)
router.get('/subscribed',auth, getSubscribedPosts);
router.patch('/:id', auth, updatePost);
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);

//Like/Dislike Routes
router.post('/:id/like', auth, likePost);
router.post('/:id/dislike', auth, dislikePost);
router.post('/:id/comment/:commentId/like', auth, likeComment);
router.post('/:id/comment/:commentId/dislike', auth, dislikeComment);
router.post('/:id/comment/:commentId/reply/:replyId/like', auth, likeReply);
router.post('/:id/comment/:commentId/reply/:replyId/dislike', auth, dislikeReply);

//Comments And Replies Routes
router.post('/:id/comment', auth, postComment);
router.delete('/:id/comment/:commentId', auth, deleteComment);
router.patch('/:id/comment/:commentId', auth, updateComment);
router.post('/:id/comment/:commentId/reply', auth, postReply);
router.delete('/:id/comment/:commentId/reply/:replyId', auth, deleteReply);
router.patch('/:id/comment/:commentId/reply/:replyId', auth, updateReply);


module.exports = router;