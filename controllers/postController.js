const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Post, User, Blog } = require('../models');

const createPost = catchAsync(async (req, res, next) => {
  const { user, body } = req;
  const blog = user.blog.uuid;

  if (!blog) {
    return next(new AppError('User does not have a blog', 403));
  }

  const newPost = await Post.create({
    title: body.title,
    body: body.body,
    createdBy: user.uuid,
    blogId: blog,
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
