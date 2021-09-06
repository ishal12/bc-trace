const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfuly!');
});

/** Router */
const usersRouter = require('./routers/users');
const livestocksRouter = require('./routers/livestocks');
const slaughtersRouter = require('./routers/slaughters');

app.use('/users', usersRouter);
app.use('/livestocks', livestocksRouter);
app.use('/slaughters', slaughtersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port} `);
    console.log(uri);
});
