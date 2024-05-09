const Joi = require('joi');

const createBlog = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const updateBlog = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  createBlog,
  updateBlog,
};
