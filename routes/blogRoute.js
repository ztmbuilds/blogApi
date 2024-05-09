const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const blogSchema = require('../validation/blogSchema');

router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(validate(blogSchema.createBlog), blogController.createBlog);
router
  .route('/:uuid')
  .get(blogController.getBlog)
  .patch(validate(blogSchema.updateBlog), blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
