import supertest from 'supertest';
import { app, removeTestUser, createTestUser, getToken } from './utils';

describe('GET /api/user/:username - get user profile', () => {
  let token = '';
  const userId = 'user-profile';
  const secondUser = `${userId}-real`;

  const TEST_API = (user = userId) => `/api/user/${user}`;

  beforeAll(async () => {
    await removeTestUser(userId);
    await createTestUser(secondUser);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  it('should error if user not found', async () => {
    const result = await supertest(app).get(TEST_API('123'));
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({ errors: 'User not found!' });
  });

  it('should return following info if the user logged in', async () => {
    await supertest(app).post(`/api/user/${secondUser}/follow`).set('Authorization', `Bearer ${token}`);
    const result = await supertest(app).get(TEST_API(secondUser)).set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        user: {
          bio: null,
          following: true,
          image: null,
          username: 'user-profile-real',
        },
      },
    });
  });

  it('should return following is false if the user is not logged in', async () => {
    const result = await supertest(app).get(TEST_API(secondUser));
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        user: {
          bio: null,
          following: false,
          image: null,
          username: 'user-profile-real',
        },
      },
    });
  });
});

describe('POST /api/user/:username/follow - follow user', () => {
  let token = '';
  const userId = 'user-profile-follow';
  const secondUser = `${userId}-real`;

  const TEST_API = (user = userId) => `/api/user/${user}/follow `;

  beforeAll(async () => {
    await removeTestUser(userId);
    await createTestUser(secondUser);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  })

  describe('should error', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).post(TEST_API('123xx'));
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({ errors: 'No authorization token was found' });
    });

    it('if user not found', async () => {
      const result = await supertest(app).post(TEST_API('123xx')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({ errors: 'User not found!' });
    });

    it('if user follow them self', async () => {
      const result = await supertest(app).post(TEST_API(userId)).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(422);
      expect(result.body).toEqual({ errors: 'Unable to follow yourself' });
    });
  });

  it('should allow me to follow user', async () => {
    const result = await supertest(app).post(`/api/user/${secondUser}/follow`).set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        success: true,
      },
    });
  });
});

describe('POST /api/user/:username/unfollow - unfollow user', () => {
  let token = '';
  const userId = 'user-profile-unfollow';
  const secondUser = `${userId}-real`;

  const TEST_API = (user = userId) => `/api/user/${user}/unfollow `;

  beforeAll(async () => {
    await removeTestUser(userId);
    await createTestUser(secondUser);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  })
  
  describe('should error', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).post(TEST_API('123xx'));
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({ errors: 'No authorization token was found' });
    });

    it('if user not found', async () => {
      const result = await supertest(app).post(TEST_API('123xx')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({ errors: 'User not found!' });
    });

    it('if user unfollow them self', async () => {
      const result = await supertest(app).post(TEST_API(userId)).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(422);
      expect(result.body).toEqual({ errors: 'Unable to unfollow yourself' });
    });

    it('if user already unfollowed', async () => {
      const result = await supertest(app).post(TEST_API(secondUser)).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'User already unfollowed',
      });
    });
  });

  it('should allow me to unfollow user', async () => {
    await supertest(app).post(`/api/user/${secondUser}/follow`).set('Authorization', `Bearer ${token}`);
    const result = await supertest(app)
      .post(`/api/user/${secondUser}/unfollow`)
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        success: true,
      },
    });
  });
});
