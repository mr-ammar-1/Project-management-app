const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for CRUD operations on users
router.post('/users', userController.addUser);
router.put('/users', userController.updateUser);
router.delete('/users', userController.deleteUser);
router.post('/login', userController.login);
router.get('/users', userController.getAllUsers);
router.get('/notifications/:email', userController.getNotificationsByEmail);

router.put('/notifications', userController.markNotificationsAsRead);




module.exports = router;