const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
} = require('../controllers/workspaceController');

router.get('/', authenticate, getWorkspaces);
router.post('/', authenticate, createWorkspace);
router.put('/:id', authenticate, updateWorkspace);
router.delete('/:id', authenticate, deleteWorkspace);

module.exports = router;