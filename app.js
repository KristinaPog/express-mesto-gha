const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users.js');
const cardRouter = require('./routes/cards.js');
const {STATUS_CODE_NOT_FOUND} = require('./utils/errors.js')

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64b0fcae226da379784eb947'
  };
  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_CODE_NOT_FOUND).json({ message: 'Страница не найдена' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});