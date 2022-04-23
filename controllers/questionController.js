/* eslint-disable no-plusplus */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
// import chalk from 'chalk';

const User = require('./../models/userModel');
const Question = require('./../models/questionModel');

//const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.newQuestion = catchAsync(async (req, res, next) => {
	const { user } = req;

	const question = await Question.create({
		title: req.body.title,
		description: req.body.description,
		tags: req.body.tags,
		user: user.id,
	});

	res.status(200).json({
		message: 'success',
		data: {
			question,
		},
	});
});
exports.getQuestion = catchAsync(async (req, res, next) => {});
exports.getAllQuestions = catchAsync(async (req, res, next) => {
	let { page } = req.query;
	const { size, sort, tag } = req.query;
	const { user } = req;

	if (!page) page = 1;
	let questions;

	if (tag) {
		console.log(' tag found: ', tag);
		const query = { tags: tag };
		questions = await Question.find(query)
			.sort({ dateCreated: -1 })
			.limit(parseInt(size, 10))
			.skip(parseInt((page - 1) * size, 10))
			.populate({
				path: 'user answers.user',
			});
	} else {
		console.log('No tag found');
		questions = await Question.find()
			.sort({ dateCreated: -1 })
			.limit(parseInt(size, 10))
			.skip(parseInt((page - 1) * size, 10))
			.populate({
				path: 'user answers.user',
			});
		
	}

	// if ((sort === 'intresting' || !sort) && user) {

	// 	questions = questions.filter(question => {
	// 		let flag = false;
	// 		question.tags.forEach(tag => {

	// 			if (user.tags.includes(tag)) {
	// 				flag = true;
	// 			}

	// 		});
	// 		return flag;

	// 	});
	// }
	//console.log(questions);

	res.status(200).json({
		message: 'success',
		data: {
			questions,
		},
	});
});
exports.postAnswer = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const { answerBody } = req.body;
	const { user } = req;
	console.log(answerBody, req.body);

	if (!answerBody || answerBody === null) {
		return next(new AppError('Answer Body cannot be empty', 400));
	}

	const question = await Question.findById(id);
	console.log(question);

	question.answers.push({
		body: answerBody,
		date: Date.now(),
		user: user.id,
	});

	console.log({ answerBody, user, question });

	const updatedQuestion = await Question.findByIdAndUpdate(id, question, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		message: 'success',
		body: {
			question: updatedQuestion,
		},
	});
});
exports.deleteQuestion = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const { user } = req;

	const question = await Question.findById(id);

	if (`${user._id}` !== `${question.user}`) {
		return next(
			new AppError(
				'You donot have permission to perform this action',
				403
			)
		);
	}
	await Question.findByIdAndDelete(id);

	res.status(200).json({
		message: 'success',
	});
});
exports.deleteAnswer = catchAsync(async (req, res, next) => {
	const { questionId, answerId } = req.params;
	const { user } = req;

	const question = await Question.findById(questionId);
	//console.log(question.user, user._id, typeof question.user, typeof user._id);
	const answer = question.answers.find(
		(ans) => `${answerId}` === `${ans.id}`
	);
	if (!answer) {
		return next(new AppError('No such answer found', 404));
	}
	if (`${user._id}` !== `${answer.user}`) {
		return next(
			new AppError(
				'You donot have permission to perform this action',
				403
			)
		);
	}
	// console.log(question.answers.length);
	question.answers.splice(question.answers.indexOf(answer), 1);
	// console.log(question.answers.length);
	await Question.findByIdAndUpdate(questionId, question);

	res.status(200).json({
		message: 'success',
	});
});
exports.voteQuestion = catchAsync(async (req, res, next) => {
	const { id, vote } = req.params;
	const { user } = req;
	const question = await Question.findById(id);
	console.log(typeof vote);
	if (vote === 'upVote') {
		if (question.upVotes.includes(user.id)) {
			return next(
				new AppError('ALready upVoted once. Cannot do it again')
			);
		}
		const index = question.downVotes.indexOf(user.id);
		console.log(question.upVotes.length - question.downVotes.length);
		if (index !== -1) {
			question.downVotes.splice(index, 1);
		}
		question.upVotes.push(user.id);
		console.log(question.upVotes.length - question.downVotes.length);
	}
	if (vote === 'downVote') {
		if (question.downVotes.includes(user.id)) {
			return next(
				new AppError('ALready downVoted once. Cannot do it again')
			);
		}
		const index = question.upVotes.indexOf(user.id);
		console.log(question.upVotes.length - question.downVotes.length);
		if (index !== -1) {
			question.upVotes.splice(index, 1);
		}
		question.downVotes.push(user.id);
		console.log(question.upVotes.length - question.downVotes.length);
	}

	await Question.findByIdAndUpdate(id, question);

	res.status(200).json({
		message: 'success',
	});
});
exports.voteAnswer = catchAsync(async (req, res, next) => {
	const { questionId, vote, answerId } = req.params;
	const { user } = req;
	const question = await Question.findById(questionId);
	const answer = question.answers.find(
		(ans) => `${answerId}` === `${ans.id}`
	);
	if (!answer) {
		return next(new AppError('No such Answer found', 404));
	}
	const answerIndex = question.answers.indexOf(answer);
	if (vote === 'upVote') {
		if (answer.upVotes.includes(user.id)) {
			return next(
				new AppError('ALready upVoted once. Cannot do it again')
			);
		}
		const index = answer.downVotes.indexOf(user.id);
		console.log(answer.upVotes.length - answer.downVotes.length);
		if (index !== -1) {
			answer.downVotes.splice(index, 1);
		}
		answer.upVotes.push(user.id);
		console.log(answer.upVotes.length - answer.downVotes.length);
	}
	if (vote === 'downVote') {
		if (answer.downVotes.includes(user.id)) {
			return next(
				new AppError('ALready downVoted once. Cannot do it again')
			);
		}
		const index = answer.upVotes.indexOf(user.id);
		console.log(answer.upVotes.length - answer.downVotes.length);
		if (index !== -1) {
			answer.upVotes.splice(index, 1);
		}
		answer.downVotes.push(user.id);
		console.log(answer.upVotes.length - answer.downVotes.length);
	}
	question.answers[answerIndex] = answer;
	await Question.findByIdAndUpdate(questionId, question);

	res.status(200).json({
		message: 'success',
	});
});
