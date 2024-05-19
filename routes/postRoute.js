const router = require('express').Router();
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const { redisCacheMiddleware } = require('../middlewares/redis');
const validate = require('../middlewares/validate');
const postSchema = require('../validation/postSchema');

router.route('/').get(postController.getAllPosts).post(
  authController.protect,
  authController.restrictTo('writer'),
  // validate(postSchema),
  postController.createPost
);

router
  .route('/:uuid')
  .get(postController.getPost)
  .patch(
    authController.protect,
    authController.restrictTo('writer'),
    authController.protect,
    postController.updatePost
  );

router.patch(
  '/publish/:uuid',
  authController.protect,
  authController.restrictTo('writer'),
  postController.publishPost
);

module.exports = router;
