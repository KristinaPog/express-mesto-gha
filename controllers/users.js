const User = require('../models/user.js');

const { STATUS_CODE_OK, STATUS_CODE_CREATED, STATUS_CODE_BAD_REQUEST, STATUS_CODE_NOT_FOUND, STATUS_CODE_DEFAULT_ERROR } = require('../utils/errors.js');


module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(STATUS_CODE_CREATED).send({ data: user }))
    .catch(
      (err) => {
        if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' }); return; }
        else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }) }
      });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(STATUS_CODE_OK).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' }); return; }
      else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }) }
    });
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); return; })
    .then(user => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные' }); return; }
      else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }) }
    });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); return; })
    .then(user => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' }); return; }
      else if (err.name === 'CastError') { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); return; }
      else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }) }
    });
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {  new: true, runValidators: true })
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); return; })
    .then(user => res.status(STATUS_CODE_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' }); return; }
      else if (err.name === 'ValidationError') { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }); return; }
      else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }) }
    });
}