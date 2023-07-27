const userRouter = require('express').Router();
const {
  getMe, getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.get('/me', getMe);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
