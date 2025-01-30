const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment-controller');

router.use(express.json())

router.post('/addComment', CommentController.addComment);
router.patch('/updateComment', CommentController.updateComment);
router.delete('/deleteComment',CommentController.deleteComment);
router.get('/getComment/:movieId',CommentController.getComments);

module.exports = router;
