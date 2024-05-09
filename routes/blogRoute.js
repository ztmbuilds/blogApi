const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const blogSchema = require('../validation/blogSchema');

router = express.Router();

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    validate(blogSchema.createBlog),
    blogController.createBlog
  );

router
  .route('/:uuid')
  .get(blogController.getBlog)
  .patch(authController.protect, blogController.updateBlog);

module.exports = router;
