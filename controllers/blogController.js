const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { Blog, User, Post } = require('../models');

exports.createBlog = catchAsync(async (req, res, next) => {
  const { user, body } = req;

  if (user.role !== 'writer') {
    return next(new AppError('Only a writer can create a blog', 403));
  }

  const newBlog = await Blog.create({
    title: body.title,
    owner: user.uuid,
    description: body.description,
  });

  return res.status(201).json({
    status: 'success',
    data: newBlog,
  });
});

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findAndCountAll();

  return res.status(200).json({
    status: 'success',
    results: blogs.count,
    data: blogs,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;

  const blog = await Blog.findByPk(uuid, {
    include: [{ model: Post, as: 'posts' }],
  });

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: blog,
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const { title, description } = req.body;
  const user = req.user;

  const blog = await Blog.findByPk(uuid);

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  if (user.uuid !== blog.owner) {
    return next(
      new AppError('You cannot update the blog as you are not the owner', 403)
    );
  }

  blog.set({
    title,
    description,
  });

  await blog.save();

  return res.status(200).json({
    status: 'success',
    data: blog,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { uuid } = req.params;
  const user = req.user;

  const blog = await Blog.findByPk(uuid);

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }
  if (user.uuid !== blog.owner) {
    return next(
      new AppError('You cannot delete the blog as you are not the owner', 403)
    );
  }

  await blog.destroy();

  return res.status(204).json({
    status: 'success',
  });
});
