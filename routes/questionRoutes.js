const express = require('express');
//const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const questionController = require('../controllers/questionController');

const Router = express.Router();

Router.route('/')
	.post(authController.protect, questionController.newQuestion)
	.get(questionController.getAllQuestions);

Router.route('/:id')
	.get(questionController.getQuestion)
	.patch(authController.protect, questionController.getQuestion)
	.delete();


module.exports = Router;
