router = require('express').Router();
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const { redisCacheMiddleware } = require('../middlewares/redis');
const validate = require('../middlewares/validate');
const postSchema = require('../validation/postSchema');

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    validate(postSchema),
    postController.createPost
  );

router
  .route('/:uuid')
  .get(postController.getPost)
  .patch(postController.publishPost);

module.exports = router;
