const mongoose = require('mongoose');
const User = require('./user');
const Group = require('./group');
const schemaCleaner = require('../utils/schemaCleaner');

const replySchema = new mongoose.Schema ({
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    replyBody: {
        type: String,
        trim: true,
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],

    pointsCount: {
        type:Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});



const commentSchema = new mongoose.Schema ({
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    commentBody: {
        type: String,
        trim: true,
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    replies: [replySchema],
    pointsCount: {
        type:Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    postTitle: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    postBody: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
   

    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },

    pointsCount: {
        type: Number,
        default: 1
    },
    comments: [commentSchema],

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },
    commentCount: {
        type: Number,
        default: 1
    }
});

schemaCleaner(postSchema);
schemaCleaner(commentSchema);
schemaCleaner(replySchema);


module.exports = mongoose.model('Post', postSchema)