const express = require('express');

const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { STATUS_CODE_NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_CODE_NOT_FOUND).json({ message: 'Страница не найдена' });
});
app.listen(PORT);
