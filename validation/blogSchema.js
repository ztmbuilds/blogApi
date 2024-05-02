const Joi = require('joi');

const createBlog = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = {
  createBlog,
};
