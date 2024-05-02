const request = require('supertest');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const app = require('../app');
require('dotenv').config({ path: `${process.cwd()}/.env` });

jest.setTimeout(180000);

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
    { uuid: 'e4fd9163-66bc-4cf3-b864-eb21c8c1a92f' }, //use valid user_uuid
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

  it('Returns an error if there is a null value for non-nullable field', () => {
    return request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token()}`)
      .expect('Content-Type', /json/)
      .send({ title: null, description: null })
      .expect(406)
      .then((response) => {
        expect(response.body.status).toBe('fail');
      });
  });
});

describe('GET /blogs/:uuid', () => {
  it('Gets a blog and the posts', () => {
    return request(app)
      .get('/api/blogs/6184d041-f2c4-4bbc-abd7-68e75e6f0622') //use valid blog_uuid
      .set('Authorization', `Bearer ${token()}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status);
      });
  });
});
