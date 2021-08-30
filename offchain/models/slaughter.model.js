const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const slaughterSchema = new Schema(
    {
        addressRPH: {
            type: String,
            required: true,
        },
        beefId: {
            type: String,
            required: true,
        },
        livestock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Livestock",
        },
        age: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['produktif', 'bunting', 'lainnya', 'diterima', 'antemortem', 'postmortem'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Slaughter = mongoose.model('Slaughter', slaughterSchema);

module.exports = Slaughter;
