const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getComments,
  createComment,
  deleteComment
} = require('../controllers/commentController');

router.get('/tasks/:taskId/comments', authenticate, getComments);
router.post('/tasks/:taskId/comments', authenticate, createComment);
router.delete('/comments/:id', authenticate, deleteComment);

module.exports = router;