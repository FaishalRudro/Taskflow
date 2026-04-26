const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  addMember
} = require('../controllers/workspaceController');

router.get('/', authenticate, getWorkspaces);
router.post('/', authenticate, createWorkspace);
router.put('/:id', authenticate, updateWorkspace);
router.delete('/:id', authenticate, deleteWorkspace);
router.get('/:id/members', authenticate, getMembers);
router.post('/:id/members', authenticate, addMember);

module.exports = router;