const express = require('express');

const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { STATUS_CODE_NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64b0fcae226da379784eb947',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_CODE_NOT_FOUND).json({ message: 'Страница не найдена' });
});
app.listen(PORT);
