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
      model: Blog,
      as: 'blog',
    },
  });

  res.status(200).json({
    status: 'success',
    data: posts,
  });
});

const getPost = catchAsync(async (req, res, next) => {
  const postuuid = req.params.uuid;

  const post = await Post.findByPk(postuuid, {
    include: {
      model: Blog,
      as: 'blog',
    },
  });

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  post.readCount += 1;
  await post.save();

  res.status(200).json({
    status: 'success',
    data: post,
  });
});

const publishPost = catchAsync(async (req, res, next) => {
  const postuuid = req.params.uuid;

  const post = await Post.findByPk(postuuid, {
    include: {
      model: Blog,
      as: 'blog',
    },
  });

  post.state = 'published';
  await post.save();

  res.status(200).json({
    status: 'success',
    data: post,
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  publishPost,
};
