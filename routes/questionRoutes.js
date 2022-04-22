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
	// .patch(authController.protect, questionController.updateQuestion)
	.delete();

// Router.patch('/vote', authController.protect, questionController.updateVote);

Router.route('/:id/answer')
	// .patch(authController.protect, questionController.updateAnswer)
	.post(authController.protect, questionController.postAnswer)
	// .delete(authController.protect, questionController.deleteAnswer);


module.exports = Router;
