const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Post, User } = require('../models');

const createPost = catchAsync(async (req, res, next) => {
  const { user, body } = req;

  const newPost = await Post.create({
    title: body.title,
    body: body.body,
    createdBy: user.id,
  });

  return res.status(201).json({
    status: 'success',
    data: newPost,
  });
});

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAndCountAll({
    include: {
      model: User,
      as: 'user',
    },
  });

  res.status(200).json({
    status: 'success',
    data: posts,
  });
});

module.exports = {
  createPost,
  getAllPosts,
};
