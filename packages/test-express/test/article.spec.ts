import supertest from 'supertest';
import { app, removeTestUser, getToken, createArticles, NOT_FOUND_USER_TOKEN } from './utils';

describe('POST /api/article - create article', () => {
  let token = '';
  const TEST_API = '/api/article';
  const userId = 'user-create-article';

  beforeAll(async () => {
    await removeTestUser(userId);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).post(TEST_API).send();
      expect(result.body).toEqual({ errors: 'No authorization token was found' });
    });

    it('if title is not provided', async () => {
      const result = await supertest(app).post(TEST_API).set('Authorization', `Bearer ${token}`).send({
        description: 'description',
        body: 'body',
      });

      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        errors: 'Title is required',
      });
    });
  });

  it('should allow me to create article', async () => {
    const result = await supertest(app).post(TEST_API).set('Authorization', `Bearer ${token}`).send({
      description: 'description',
      body: 'body',
      title: 'title',
    });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        article: {
          authorId: expect.any(Number),
          body: 'body',
          createdAt: expect.any(String),
          description: 'description',
          favorited: false,
          favoritesCount: 0,
          id: expect.any(Number),
          slug: expect.stringContaining('title-'),
          title: 'title',
          updatedAt: expect.any(String),
        },
      },
    });
  });
});

describe('GET /api/article/:slug - get article', () => {
  let token = '';
  const TEST_API = (slug: string) => `/api/article/${slug}`;
  const userId = 'user-get-article';

  beforeAll(async () => {
    await removeTestUser(userId);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  it('should error if article not found', async () => {
    const result = await supertest(app).get(TEST_API('123'));
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({
      errors: 'Article not found!',
    });
  });

  it('should return favorited info if the article logged in', async () => {
    const data = await createArticles(token);
    const result = await supertest(app).get(TEST_API(data?.article?.slug));

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        article: {
          body: 'test-body',
          createdAt: expect.any(String),
          description: 'test-description',
          id: expect.any(Number),
          slug: expect.stringContaining('test-title-'),
          title: 'test-title',
          updatedAt: expect.any(String),
          authorId: expect.any(Number),
          favorited: false,
          favoritesCount: 0,
        },
      },
    });
  });

  it('should return favorited is false if the article is not logged in', async () => {
    const data = await createArticles(token);
    await supertest(app).post(`/api/article/${data?.article?.slug}/favorite`).set('Authorization', `Bearer ${token}`);
    const result = await supertest(app).get(TEST_API(data?.article?.slug)).set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        article: {
          body: 'test-body',
          createdAt: expect.any(String),
          description: 'test-description',
          id: expect.any(Number),
          slug: expect.stringContaining('test-title-'),
          title: 'test-title',
          updatedAt: expect.any(String),
          authorId: expect.any(Number),
          favorited: true,
          favoritesCount: 1,
        },
      },
    });
  });
});

describe('PATCH /api/article/:slug - update article', () => {
  let token = '';
  const TEST_API = (slug: string) => `/api/article/${slug}`;
  const userId = 'user-update-article';

  beforeAll(async () => {
    await removeTestUser(userId);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error ', () => {
    it('if token is not provided', async () => {
      const result = await supertest(app).patch(TEST_API('123'));
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        errors: 'No authorization token was found',
      });
    });

    it('should error if article not found', async () => {
      const result = await supertest(app).patch(TEST_API('123')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        errors: 'Article not found!',
      });
    });

    it('if the current user does not have the article', async () => {
      const data = await createArticles(token);

      const result = await supertest(app)
        .patch(TEST_API(data?.article?.slug))
        .set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`);
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        errors: 'User unauthorized!',
      });
    });
  });

  it('should allow me to change my article', async () => {});

  it('should not change the article slug if the title is not changed', async () => {
    const data = await createArticles(token);
    const result = await supertest(app)
      .patch(TEST_API(data?.article?.slug))
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'description-123',
        body: 'body-123',
        title: 'title-332',
      });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        article: {
          authorId: data?.article?.authorId,
          body: 'body-123',
          createdAt: expect.any(String),
          description: 'description-123',
          favorited: false,
          favoritesCount: 0,
          id: data?.article?.id,
          slug: expect.stringContaining('title-332'),
          title: 'title-332',
          updatedAt: expect.any(String),
        },
      },
    });
  });
});

describe('DELETE /api/article/:slug - delete article', () => {
  let token = '';
  const TEST_API = (slug: string) => `/api/article/${slug}`;
  const userId = 'user-delete-article';

  beforeAll(async () => {
    await removeTestUser(userId);
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error ', () => {
    it('if token is not provided', async () => {
      const result = await supertest(app).delete(TEST_API('123'));
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        errors: 'No authorization token was found',
      });
    });

    it('should error if article not found', async () => {
      const result = await supertest(app).delete(TEST_API('123')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        errors: 'Article not found!',
      });
    });

    it('if the current user does not have the article', async () => {
      const data = await createArticles(token);

      const result = await supertest(app)
        .delete(TEST_API(data?.article?.slug))
        .set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`);
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        errors: 'User unauthorized!',
      });
    });
  });

  it('should allow me to delete my article', async () => {
    const data = await createArticles(token);
    const result = await supertest(app).delete(TEST_API(data?.article?.slug)).set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        success: true,
      },
    });
  });
});

describe('POST /api/article/:slug/favorite - favorite article', () => {
  describe('should error', () => {
    it('if article not found', async () => {});

    it('if article not logged in', async () => {});

    it('if article already favorited', async () => {});
  });

  it('should allow me to favorite article', async () => {});
});

describe('POST /api/article/:slug/unfavorite - favorite article', () => {
  describe('should error', () => {
    it('if article not found', async () => {});

    it('if article not logged in', async () => {});

    it('if article already unfavorited', async () => {});
  });

  it('should allow me to unfavorite article', async () => {});
});
