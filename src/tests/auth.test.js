const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Auth', () => {
  it('signup and login', async () => {
    const email = `test${Date.now()}@example.com`;
    const signupRes = await request(app).post('/auth/signup').send({ email, password: 'secret123' });
    expect(signupRes.statusCode).toBe(201);

    const loginRes = await request(app).post('/auth/login').send({ email, password: 'secret123' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});
