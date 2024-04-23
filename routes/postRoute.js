router = require('express').Router();
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const {redisCacheMiddleware} = require('../middlewares/redis')

router
  .route('/')
  .get(redisCacheMiddleware(), postController.getAllPosts)
  .post(authController.protect, postController.createPost);

module.exports = router;
