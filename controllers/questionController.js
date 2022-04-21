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
		user: user.id   
	});

	res.status(200).json({
		message: "success",
		data: {
			question
		}
	});

});
exports.getQuestion = catchAsync(async (req, res, next) => {
	
});
exports.getAllQuestions = catchAsync(async (req, res, next) => {
	
	let { page, size, sort } = req.query;
	const { user } = req;

	if (!page) page = 1;
	const questions = await Question.find()
		.sort({ dateCreated: -1 })
		.limit(parseInt(size, 10))
		.skip(parseInt((page - 1) * size, 10))
		.populate({
			path: 'user',
			select: 'name id'
		});

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
		message: "success",
		data: {
			questions
		}
	});
});