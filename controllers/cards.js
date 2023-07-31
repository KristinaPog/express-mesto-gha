const Card = require('../models/card');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_DEFAULT_ERROR,
} = require('../utils/errors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CODE_CREATED).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send(cards))
    .catch(() => {
      res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, { runValidators: true })
    .orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Карточка по указанному _id не найденa' }); })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card).then(res.status(STATUS_CODE_OK).send(card));
      } else { res.status(403).send({ message: 'Эта карточка принадлежит другому пользователю' }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Карточка по указанному _id не найденa' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Карточка по указанному _id не найденa' }); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => { res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Карточка по указанному _id не найденa' }); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные' }); } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }); }
    });
};
