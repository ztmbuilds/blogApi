const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Post, User, Blog } = require('../models');
const apiFeatures = require('../utils/apiFeatures');

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
  // Sample Query /api/posts?createdAt_gt=2022-01-01&page=2&pageSize=10&sort=createdAt:desc,title:asc

  const features = apiFeatures(req.query);

  const { count, rows } = await Post.findAndCountAll({
    where: features.whereClause,
    order: features.order,
    offset: features.offset,
    limit: features.limit,
    attributes: features.selectedAttributes,
    include: {
      model: Blog,
      as: 'blog',
    },
  });

  res.status(200).json({
    status: 'success',
    results: count,
    data: rows,
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

const updatePost = catchAsync(async (req, res, next) => {
  const postuuid = req.params.uuid;
  const { body, user } = req;

  const post = await Post.findByPk(postuuid);

  if (user.blog.uuid !== post.blogId) {
    return next(new AppError('Only the blog owner can update posts', 403));
  }

  const updates = {};
  if (body.title !== undefined) {
    updates.title = body.title;
  }
  if (body.body !== undefined) {
    updates.body = body.body;
  }

  await post.update(updates);

  res.status(200).json({
    status: 'success',
    data: post,
  });
});

const publishPost = catchAsync(async (req, res, next) => {
  const postuuid = req.params.uuid;
  const user = req.user;

  const post = await Post.findByPk(postuuid, {
    include: {
      model: Blog,
      as: 'blog',
    },
  });

  if (user.blog.uuid !== post.blogId) {
    return next(new AppError('Only the blog owner can update posts', 403));
  }

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
  updatePost,
};
