const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const blogSchema = require('../validation/blogSchema');

router = express.Router();

router.post(
  '/',
  authController.protect,
  validate(blogSchema.createBlog),
  blogController.createBlog
);

module.exports = router;
