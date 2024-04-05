const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatar: {
        exists: {
            type: Boolean,
            default: 'false',
        },
        imageLink: {
            type: String,
            trim: true,
            default: 'null'
        },
        imageId: {
            type: String,
            trim: true,
            default: 'null'
        }
    },

    likes: {
        postLikes: {
            type: Number,
            default: 0
        },
        commentLikes: {
            type: Number,
            default: 0
        },
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    joinedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
    totalPosts: {
        type: Number,
        default: 0,
    },
    totalComments: {
        type:Number,
        default: 0,
    },

},
{
    timestamps: true,
}
);

userSchema.plugin(uniqueValidator);

schemaCleaner(userSchema);

module.exports = mongoose.model('User', userSchema);
