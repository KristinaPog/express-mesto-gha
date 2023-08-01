const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { STATUS_CODE_DEFAULT_ERROR } = require('./errors/errors');
const NotFound = require('./errors/notFound');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound({ message: 'Страница не найдена' }));
});

app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' }); }
  next();
});

app.listen(PORT);
