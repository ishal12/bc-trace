const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        address: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            enum: [0, 1, 2, 3],
            required: true,
        },
        status: {
            type: Number,
            enum: [0, 1, 2],
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
