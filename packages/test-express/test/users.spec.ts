import supertest from 'supertest';
import { app, removeTestUser, createTestUser } from './utils';

describe('POST /api/users - register', () => {
  afterEach(async () => {
    await removeTestUser();
  });
  describe('should error', () => {
    describe('if password is not meet the requirement', () => {
      it('should not be empty', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: 'testid-username',
          email: 'testid-email@email.com',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Password is required');
      });

      it('should meet the minimum length', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: 'testid-username',
          email: 'testid-email@email.com',
          password: '123',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Password should have 6 characters minimum');
      });

      it('should meet the maximum length', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: 'testid-username',
          email: 'testid-email@email.com',
          password:
            '213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Password is too long');
      });
    });

    describe('if username is not meet the requirement', () => {
      it('should not be empty', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: '',
          email: 'testid-email@email.com',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Username is required');
      });

      it('should meet the maximum length', async () => {
        const result = await supertest(app).post('/api/users').send({
          username:
            '213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132',
          email: 'testid-email@email.com',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Username is too long');
      });
    });

    describe('if email is not meet the requirement', () => {
      it('should not be empty', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: 'testid-username',
          email: '',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Email is required');
      });

      it('should meet the maximum length', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: 'testid-username',
          email:
            '213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132@email.com',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Email is too long');
      });

      it('should meet the email format', async () => {
        const result = await supertest(app).post('/api/users').send({
          username: 'testid-username',
          email: '12345',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Invalid email');
      });
    });
  });

  it('should allow me to register new user', async () => {
    const result = await supertest(app).post('/api/users').send({
      username: 'testid-username',
      email: 'testid@testid.com',
      password: 'password',
    });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        user: {
          email: 'testid@testid.com',
          token: expect.any(String),
          username: 'testid-username',
          bio: null,
          image: null,
        },
      },
    });
  });

  describe('should error', () => {
    beforeEach(async () => {
      await createTestUser();
    });

    it('if username is alreay registered', async () => {
      const result = await supertest(app).post('/api/users').send({
        username: 'testid-username',
        email: 'testid@testidzz.com',
        password: 'password',
      });

      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'Username or email had been used',
      });
    });

    it('if email is alreay registered', async () => {
      const result = await supertest(app).post('/api/users').send({
        username: 'testid-usernamezz',
        email: 'testid@testid.com',
        password: 'password',
      });

      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'Username or email had been used',
      });
    });
  });
});

describe('POST /api/users/login - login', () => {
  const API = '/api/users/login';
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  describe('should error', () => {
    describe('if password is not meet the requirement', () => {
      it('should not be empty', async () => {
        const result = await supertest(app).post(API).send({
          email: 'testid-email@email.com',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Password is required');
      });

      it('should meet the minimum length', async () => {
        const result = await supertest(app).post(API).send({
          email: 'testid-email@email.com',
          password: '123',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Password should have 6 characters minimum');
      });
    });

    describe('if email is not meet the requirement', () => {
      it('should not be empty', async () => {
        const result = await supertest(app).post(API).send({
          email: '',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Email is required');
      });

      it('should meet the maximum length', async () => {
        const result = await supertest(app).post(API).send({
          email:
            '213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132213123sadad213123132@email.com',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Email is too long');
      });

      it('should meet the email format', async () => {
        const result = await supertest(app).post(API).send({
          email: '12345',
          password: 'password',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('Invalid email');
      });
    });
  });

  it('should allow me to login', async () => {
    const result = await supertest(app).post(API).send({
      email: 'testid@testid.com',
      password: 'password',
    });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        user: {
          email: 'testid@testid.com',
          token: expect.any(String),
          username: 'testid-username',
          bio: null,
          image: null,
        },
      },
    });
  });

  describe('should error', () => {
    it('if username is invalid', async () => {
      const result = await supertest(app).post(API).send({
        email: 'testid@testidzz.com',
        password: 'password',
      });

      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'Email or password is not correct!',
      });
    });

    it('if password is invalid', async () => {
      const result = await supertest(app).post(API).send({
        email: 'testid@testid.com',
        password: 'passwordxxx',
      });

      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        errors: 'Email or password is not correct!',
      });
    });
  });
});
