const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const livestockSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: Boolean,
            required: true,
        },
        weight: {
            type: Number,
        },
        length: {
            type: Number,
        },
        heartGrith: {
            type: Number,
        },
        birth: {
            type: Number,
            required: true,
        },
        race: {
            type: Number,
            required: true,
        },
        alive: {
            type: Boolean,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Livestock = mongoose.model('Livestock', livestockSchema);

module.exports = Livestock;
