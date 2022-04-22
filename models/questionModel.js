/* eslint-disable indent */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question must have a title'],
        maxLength: [100, 'Question title must have less than 100 charachters'],
    },
    description: {
        type: String,
        required: [true, 'Question must have a description'],
        maxLength: [
            10000,
            'Question description must have less than 10000 charachters',
        ],
    },
    tags: {
        type: [String],
        required: [true, 'Question must have a tags'],
        maxLength: [5, 'Only 5 tags allowed per question'],
    },
    answers: [
        {
            body: {
                type: String,
                required: [true, 'Answer must have a body'],
                maxLength: [
                    10000,
                    'Answer must have less than 10000 charachters',
                ],
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, 'Answer must have a user'],
                ref: 'User',
            },
            dateCreated: {
                type: Date,
                default: Date.now(),
            },
            upVotes: {
                type: [mongoose.Schema.Types.ObjectId],
                default: [],
            },
            downVotes: {
                type: [mongoose.Schema.Types.ObjectId],
                default: [],
            },
        },
    ],
    upVotes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    downVotes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Question must have a user'],
        ref: 'User',
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
