import supertest from 'supertest';
import { app, removeTestUser, getToken, NOT_FOUND_USER_TOKEN, createTestUser } from './utils';

describe('GET /api/user/current - get current user', () => {
  let token = '';
  const TEST_API = '/api/user/current';
  const userId = 'user-current';
  beforeAll(async () => {
    await removeTestUser(userId);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  it('should error if token is not provided', async () => {
    const result = await supertest(app).get(TEST_API).send();
    expect(result.status).toEqual(401);
    expect(result.body).toEqual({ errors: 'No authorization token was found' });
  });

  it('shoul return 404 if user not found', async () => {
    const result = await supertest(app).get(TEST_API).set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`).send();
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({
      errors: 'User not found!',
    });
  });

  it('should return current user info', async () => {
    const result = await supertest(app).get(TEST_API).set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        user: {
          bio: null,
          email: 'user-current@testid.com',
          image: null,
          username: 'user-current',
        },
      },
    });
  });
});

describe('PATCH /api/user/current - update current user', () => {
  let token = '';
  const TEST_API = '/api/user/current';
  const userId = 'user-current-update';
  beforeAll(async () => {
    await removeTestUser(userId);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error ', () => {
    it('should error if token is not provided', async () => {
      const result = await supertest(app).patch(TEST_API).send();
      expect(result.body).toEqual({ errors: 'No authorization token was found' });
    });

    it('shoul return 404 if user not found', async () => {
      const result = await supertest(app)
        .patch(TEST_API)
        .set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`)
        .send({
          bio: null,
          email: `${userId}@testid.com`,
          image: null,
          username: `${userId}`,
        });
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        errors: 'User not found',
      });
    });

    it('if email is already used', async () => {
      const id = `${userId}-real`;
      await createTestUser(id);
      const result = await supertest(app)
        .patch(TEST_API)
        .set('Authorization', `Bearer ${token}`)
        .send({
          bio: null,
          email: `${id}@testid.com`,
          image: null,
          username: `${userId}`,
        });
      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'the field email is not unique',
      });
    });

    it('if username is already used', async () => {
      const id = `${userId}-real`;
      await createTestUser(id);
      const result = await supertest(app)
        .patch(TEST_API)
        .set('Authorization', `Bearer ${token}`)
        .send({
          bio: null,
          email: `${id}@testid.com`,
          image: null,
          username: `${id}`,
        });
      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'the field username is not unique',
      });
    });

    it('if required field is not provided', async () => {
      const result = await supertest(app).patch(TEST_API).set('Authorization', `Bearer ${token}`).send({
        bio: null,
        image: null,
      });
      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        errors: 'Email is required, Username is required',
      });
    });

    it('if optional field is not meet the validation', async () => {
      const result = await supertest(app)
        .patch(TEST_API)
        .set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`)
        .send({
          bio: '1231231231232131231232131231232131231232131231232131231232131312312321312312321312312321312312321313123123213123123213123123213123123213131231232131231232131231232131231232131312312321312312321312312321312312321313123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213213',
          email: `${userId}@testid.com`,
          image: '123',
          username: `${userId}`,
        });
      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        errors: 'Bio is too long, Invalid URL',
      });
    });
  });

  it('should allow me to change my user info', async () => {
    const result = await supertest(app)
      .patch(TEST_API)
      .set('Authorization', `Bearer ${token}`)
      .send({
        bio: 'bio',
        email: `${userId}-123@testid.com`,
        image: 'https://image.com/ggwp.jpeg',
        username: `${userId}-123`,
      });
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        user: {
          bio: 'bio',
          email: 'user-current-update-123@testid.com',
          image: 'https://image.com/ggwp.jpeg',
          username: 'user-current-update-123',
        },
      },
    });
  });
});