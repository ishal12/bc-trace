const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        foodType: {
            type: String,
            Enum: ['hijauan', 'konsentrat', 'tambahan', 'vitamin', 'obat'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        actor: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
