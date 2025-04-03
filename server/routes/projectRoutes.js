const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddlewares');

// Routes for CRUD operations on projects
router.get('/projects', authMiddleware.authenticateUser, projectController.getAllProjects);
router.get('/projects/:project_id', authMiddleware.authenticateUser, projectController.getProjectById);
router.post('/projects', authMiddleware.authenticateUser, projectController.addProject);
router.delete('/projects/:project_id', authMiddleware.authenticateUser, projectController.deleteProject);

// Routes for Tasks
router.post('/tasks', authMiddleware.authenticateUser, projectController.addTask);
router.put('/tasks/status', authMiddleware.authenticateUser, projectController.updateTaskStatus);
router.post('/tasks/assign', authMiddleware.authenticateUser, projectController.assignTask);
router.get('/tasks/:task_id', authMiddleware.authenticateUser, projectController.getTaskById);
router.get('/tasks/project/:project_id', authMiddleware.authenticateUser, projectController.getTasksByProjectId);
router.get('/tasks', authMiddleware.authenticateUser, projectController.getAllTasks); // Add this route
router.get('/tasks/due-tomorrow/:email', authMiddleware.authenticateUser, projectController.getTasksDueTomorrowByEmail);



module.exports = router;
