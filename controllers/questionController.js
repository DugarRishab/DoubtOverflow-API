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