const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { Blog } = require('../models');

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

// exports.getAllBlogs = catchAsync(async(req,res,next)=>{
//     const blogs = await Blog.find
// })
