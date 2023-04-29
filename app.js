const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const scheduler = require('./scheduler');

const dotenv = require('dotenv');
dotenv.config();


const reminderRoutes = require('./routes/reminder');
userRoutes = require('./routes/user')
mongoose.connect(`${process.env.MONGODB_URI}`, {
    // useMongoClient: true
    // useCreateIndex: true,
    useNewUrlParser: true, 
    useUnifiedTopology: true
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors())

app.use('/reminder', reminderRoutes)
app.use('/user', userRoutes)

// error handler middleware
app.use((error, req, res, next) => {
    console.log(error)
      res.status(error.status || 500).json({
        // error: {
          status: error.status || 500,
          message: error.message || 'Internal Server Error',
        // },
      });
    });
console.log("Hi")
scheduler.start()
module.exports = app;