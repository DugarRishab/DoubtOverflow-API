/* eslint-disable indent */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question must have a title'],
    },
    description: {
        type: String,
        required: [true, 'Question must have a description'],
    },
    tags: {
        type: [String],
        required: [true, 'Question must have a tags'],
    },
    answers: [
        {
            body: {
                type: String,
                required: [true, 'Answer must have a body'],
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
            }
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
