const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const multer = require('multer');


const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/getsignuptoken', authController.generateSignupToken)

router
    .route('/')
    .get(userController.getAllUsers)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router