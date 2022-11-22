const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/userRoute');
const errorHandler = require('./middleWare/errorMiddleware');

const app = express();

const PORT = process.env.PORT || 5000;

//middleware

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes middleware

app.use('/api/users', userRoute);
//routes

app.get('/', (req, res) => {
  res.send('home page');
});

//Error middleware
app.use(errorHandler);

// Connect db

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
