const userRouter = require('express').Router();
const {createUser, getUsers, getUser, updateUser, updateAvatar} = require('../controllers/users.js')

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;