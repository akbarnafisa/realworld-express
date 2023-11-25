import supertest from 'supertest';
import { app, removeTestUser, getToken, NOT_FOUND_USER_TOKEN, createTestUser } from './utils';

describe('GET /api/user - get current user', () => {
  let token = '';
  const TEST_API = '/api/user';
  const userId = 'user-current';
  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  it('should error if token is not provided', async () => {
    const result = await supertest(app).get(TEST_API).send();
    expect(result.status).toEqual(401);
    expect(result.body).toEqual({
      data: null,
      error: {
        errorMsg: 'No authorization token was found',
      },
      success: false,
    });
  });

  it('shoul return 404 if user not found', async () => {
    const result = await supertest(app).get(TEST_API).set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`).send();
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({
      data: null,
      error: {
        errorMsg: 'User not found!',
      },
      success: false,
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
      error: null,
      success: true
    });
  });
});

describe('PATCH /api/user - update current user', () => {
  let token = '';
  const TEST_API = '/api/user';
  const userId = 'user-current-update';
  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error ', () => {
    it('should error if token is not provided', async () => {
      const result = await supertest(app).patch(TEST_API).send();
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'No authorization token was found',
        },
        success: false,
      });
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
        data: null,
        error: {
          errorMsg: 'User not found',
        },
        success: false,
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
        data: null,
        error: {
          errorMsg: 'The field email is not unique',
        },
        success: false,
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
          email: `${id}@test123id.com`,
          image: null,
          username: `${id}`,
        });
      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'The field username is not unique',
        },
        success: false,
      });
    });

    it('if required field is not provided', async () => {
      const result = await supertest(app).patch(TEST_API).set('Authorization', `Bearer ${token}`).send({
        bio: null,
        image: null,
      });
      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Email is required, Username is required',
        },
        success: false,
      });
    });

    it('if optional field is not meet the validation', async () => {
      const result = await supertest(app)
        .patch(TEST_API)
        .set('Authorization', `Bearer ${token}`)
        .send({
          bio: '1231231231232131231232131231232131231232131231232131231232131312312321312312321312312321312312321313123123213123123213123123213123123213131231232131231232131231232131231232131312312321312312321312312321312312321313123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213123123213213',
          email: `${userId}@testid.com`,
          image: '123',
          username: `${userId}`,
        });
      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Bio is too long, Invalid Image URL',
        },
        success: false,
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
      error: null,
      success: true
    });
  });
});
