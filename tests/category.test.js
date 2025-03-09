const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Category = require('../models/Category');

describe('Category API', () => {
  let authToken;
  
  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/category')
      .set('Authorization', authToken)
      .send({ name: 'Electronics' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all categories', async () => {
    const res = await request(app)
      .get('/api/category')
      .set('Authorization', authToken);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a category', async () => {
    const category = await Category.create({ name: 'Old Name' });

    const res = await request(app)
      .put(`/api/category/${category._id}`)
      .set('Authorization', authToken)
      .send({ name: 'New Name' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('New Name');
  });

  it('should delete a category', async () => {
    const category = await Category.create({ name: 'Delete Me' });

    const res = await request(app)
      .delete(`/api/category/${category._id}`)
      .set('Authorization', authToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Category deleted successfully');
  });
});
