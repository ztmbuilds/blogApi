const request = require('supertest');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const app = require('../app');

jest.setTimeout(180000);

describe('Blog Routes', () => {
  //connect to database
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (err) {
      console.log(err);
    }
  });

  const token = () => {
    return jwt.sign(
      { uuid: 'f9cf6b83-7fba-4c76-bea9-44f1ef05a796' },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  };

  describe('POST /blogs', () => {
    it('Creates a new blog', () => {
      const newBlog = {
        title: 'test title',
        description: 'lorem ipsum',
      };
      return request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token()}`)
        .expect('Content-Type', /json/)
        .send(newBlog)
        .expect(201)
        .then((response) => {
          expect(response.body.status).toBe('success');
        });
    });
  });
});
