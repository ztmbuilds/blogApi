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

describe('GET /blogs/', () => {
  it('Gets all blogs', () => {
    return request(app)
      .get('/api/blogs/')
      .set('Authorization', `Bearer ${token()}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data.rows)).toBe(true);
      });
  });
});

const uuid = '9e909562-3bd3-4125-ad4e-977eabacfe3b';

describe('GET /blogs/:uuid', () => {
  it('Gets a blog and the posts', () => {
    return request(app)
      .get(`/api/blogs/${uuid}`) //use valid blog_uuid
      .set('Authorization', `Bearer ${token()}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
      });
  });
});

describe('PATCH /blogs/:uuid', () => {
  it('Updates a blog', () => {
    return request(app)
      .patch(`/api/blogs/${uuid}`)
      .set('Authorization', `Bearer ${token()}`)
      .expect('Content-Type', /json/)
      .send({ title: 'new title', description: 'new description' })
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
      });
  });
});

describe('DELETE /blogs/:uuid', () => {
  it('Deletes a blog', () => {
    return request(app)
      .delete(`/api/blogs/${uuid}`)
      .set('Authorization', `Bearer ${token()}`)
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });

  it('Returns an error message when trying to delete a blog that has been deleted', () => {
    return request(app)
      .delete(`/api/blogs/${uuid}`)
      .set('Authorization', `Bearer ${token()}`)
      .expect(404)
      .then((response) => {
        expect(response.body.status).toBe('fail');
      });
  });
});
