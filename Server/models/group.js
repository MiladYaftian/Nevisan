const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const User = require('./user')
const schemaCleaner = require('../utils/schemaCleaner');
const groupSchema = new mongoose.Schema({
    groupName: {
        type:String,
        minlength:3,
        maxlength:20,
        unique: true,
        trim: true,
        required: true,
    },
    groupDescription: {
        type: String,
        minlength:3,
        maxlength: 50,
        trim: true,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subscribedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
        
    
    ],
    subscriberCount: {
        type: Number,
        default: 1
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ]

    
},
{
    timestamps: true
}
);


groupSchema.plugin(uniqueValidator);
schemaCleaner(groupSchema);

module.exports = mongoose.model('Group', groupSchema);
