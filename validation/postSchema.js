const Joi = require('joi');

const createPost = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

module.exports = {
  createPost,
};
