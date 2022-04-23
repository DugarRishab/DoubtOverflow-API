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
	.delete(authController.protect, questionController.deleteQuestion);

Router.patch('/:id/vote/:vote', authController.protect, questionController.voteQuestion);

Router.route('/:id/answer')
	// .patch(authController.protect, questionController.updateAnswer)
	.post(authController.protect, questionController.postAnswer)
	// .delete(authController.protect, questionController.deleteAnswer);

Router.route('/:questionId/answer/:answerId').patch().delete(authController.protect, questionController.deleteAnswer);
Router.route('/:questionId/answer/:answerId/vote/:vote')
	.patch(authController.protect, questionController.voteAnswer)
	
module.exports = Router;
