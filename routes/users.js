const userRouter = require('express').Router();
const {createUser, getUsers, getUser, updateUser, updateAvatar} = require('../controllers/users.js')

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;