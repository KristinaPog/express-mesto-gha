const Card = require('../models/card');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
} = require('../errors/errors');

const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CODE_CREATED).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new BadRequest({ message: 'Переданы некорректные данные при создании карточки' })); } else { next(err); }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send(cards))
    .catch(() => {
      next(new NotFound({ message: 'Ошибка по умолчанию' }));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId, { runValidators: true })
    .orFail(() => { next(new NotFound({ message: 'Карточка по указанному _id не найденa' })); })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card).then(res.status(STATUS_CODE_OK).send(card));
      } else { res.status(403).send({ message: 'Эта карточка принадлежит другому пользователю' }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') { next(new BadRequest({ message: 'Карточка по указанному _id не найденa' })); } else { next(err); }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => { next(new NotFound({ message: 'Карточка по указанному _id не найденa' })); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { next(new BadRequest({ message: 'Переданы некорректные данные' })); } else { next(err); }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => { next(new NotFound({ message: 'Карточка по указанному _id не найденa' })); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') { next(new BadRequest({ message: 'Переданы некорректные данные' })); } else { next(err); }
    });
};
