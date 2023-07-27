const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_DEFAULT_ERROR,
} = require('../utils/errors');

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(STATUS_CODE_CREATED).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(
      (err) => {
        if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' }); } else if (err.code === 11000) { res.status(409).send({ message: 'Ошибка сервера' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка сервера' }); }
      },
    );
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      res
        .status(401)
        .send({ message: 'Переданы некорректные данные' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE_OK).send(users))
    .catch(() => { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); });
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.getMe = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};
