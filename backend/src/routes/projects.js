const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.get('/workspaces/:workspaceId/projects', authenticate, getProjects);
router.post('/workspaces/:workspaceId/projects', authenticate, createProject);
router.put('/projects/:id', authenticate, updateProject);
router.delete('/projects/:id', authenticate, deleteProject);

module.exports = router;