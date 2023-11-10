import supertest from 'supertest';
import { app, removeTestUser, getToken, createArticles, NOT_FOUND_USER_TOKEN } from './utils';

describe('POST /api/article - create article', () => {
  let token = '';
  const TEST_API = '/api/article';
  const userId = 'user-create-article';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).post(TEST_API).send();
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'No authorization token was found',
        },
        success: false,
      });
    });

    it('if title is not provided', async () => {
      const result = await supertest(app)
        .post(TEST_API)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'description',
          body: 'body',
          tagList: ['test-tag'],
        });

      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Title is required',
        },
        success: false,
      });
    });
  });

  it('should allow me to create article', async () => {
    const result = await supertest(app)
      .post(TEST_API)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'description',
        tagList: ['test-tag'],
        body: 'body',
        title: 'title',
      });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      error: null,
      success: true,
      data: {
        article: {
          authorId: expect.any(Number),
          body: 'body',
          createdAt: expect.any(String),
          description: 'description',
          tags: ['test-tag'],
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
  let secondToken = '';
  const TEST_API = (slug: string) => `/api/article/${slug}`;
  const userId = 'user-get-article';
  const secondUserId = 'user-get-article-2';

  beforeAll(async () => {
    token = await getToken(userId);
    secondToken = await getToken(secondUserId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
    await removeTestUser(secondUserId);
  });

  it('should error if article not found', async () => {
    const result = await supertest(app).get(TEST_API('123'));
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({
      data: null,
      error: {
        errorMsg: 'Article not found!',
      },
      success: false,
    });
  });

  it('should return favorited is false if the article is not logged in', async () => {
    const data = await createArticles(token);
    const result = await supertest(app).get(TEST_API(data?.article?.slug));

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      error: null,
      success: true,
      data: {
        article: {
          body: 'test-body',
          createdAt: expect.any(String),
          description: 'test-description',
          tags: ['test-tag'],
          id: expect.any(Number),
          slug: expect.stringContaining('test-title-'),
          title: 'test-title',
          updatedAt: expect.any(String),
          authorId: expect.any(Number),
          favorited: false,
          favoritesCount: 0,
          author: {
            following: false,
            image: null,
            username: expect.any(String),
          },
        },
      },
    });
  });

  it('should return favorited info if the article logged in', async () => {
    const data = await createArticles(secondToken);
    await supertest(app).post(`/api/article/${data?.article?.slug}/favorite`).set('Authorization', `Bearer ${token}`);
    await supertest(app).post(`/api/user/${secondUserId}/follow`).set('Authorization', `Bearer ${token}`);

    const result = await supertest(app).get(TEST_API(data?.article?.slug)).set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      error: null,
      success: true,
      data: {
        article: {
          body: 'test-body',
          createdAt: expect.any(String),
          description: 'test-description',
          tags: ['test-tag'],
          id: expect.any(Number),
          slug: expect.stringContaining('test-title-'),
          title: 'test-title',
          updatedAt: expect.any(String),
          authorId: expect.any(Number),
          favorited: true,
          favoritesCount: 1,
          author: {
            following: true,
            image: null,
            username: expect.any(String),
          },
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
        data: null,
        error: {
          errorMsg: 'No authorization token was found',
        },
        success: false,
      });
    });

    it('should error if article not found', async () => {
      const result = await supertest(app).patch(TEST_API('123')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Article not found!',
        },
        success: false,
      });
    });

    it('if the current user does not have the article', async () => {
      const data = await createArticles(token);

      const result = await supertest(app)
        .patch(TEST_API(data?.article?.slug))
        .set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`);
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'User unauthorized!',
        },
        success: false,
      });
    });
  });

  it('should not change the article slug if the title is not changed', async () => {
    const data = await createArticles(token);
    const result = await supertest(app)
      .patch(TEST_API(data?.article?.slug))
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'description-123',
        tagList: ['test-tag'],
        body: 'body-123',
        title: 'title-332',
      });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      error: null,
      success: true,
      data: {
        article: {
          authorId: data?.article?.authorId,
          body: 'body-123',
          createdAt: expect.any(String),
          description: 'description-123',
          tags: ['test-tag'],
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
        data: null,
        error: {
          errorMsg: 'No authorization token was found',
        },
        success: false,
      });
    });

    it('should error if article not found', async () => {
      const result = await supertest(app).delete(TEST_API('123')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Article not found!',
        },
        success: false,
      });
    });

    it('if the current user does not have the article', async () => {
      const data = await createArticles(token);

      const result = await supertest(app)
        .delete(TEST_API(data?.article?.slug))
        .set('Authorization', `Bearer ${NOT_FOUND_USER_TOKEN}`);
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'User unauthorized!',
        },
        success: false,
      });
    });
  });

  it('should allow me to delete my article', async () => {
    const data = await createArticles(token);
    const result = await supertest(app).delete(TEST_API(data?.article?.slug)).set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      error: null,
      success: true,
      data: null,
    });
  });
});

describe('POST /api/article/:slug/unfavorite - unfavorite article', () => {
  let token = '';
  const TEST_API = (slug: string) => `/api/article/${slug}/unfavorite`;
  const userId = 'user-unvaforite-article';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).post(TEST_API('123'));
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'No authorization token was found',
        },
        success: false,
      });
    });

    it('should error if article not found', async () => {
      const result = await supertest(app).post(TEST_API('123')).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Article not found!',
        },
        success: false,
      });
    });

    it('if article already unfavorited', async () => {
      const data = await createArticles(token);
      const result = await supertest(app)
        .post(`/api/article/${data?.article?.slug}/unfavorite`)
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(422);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Article had been unfavorited!',
        },
        success: false,
      });
    });
  });

  it('should allow me to unfavorite article', async () => {
    const data = await createArticles(token);
    await supertest(app).post(`/api/article/${data?.article?.slug}/favorite`).set('Authorization', `Bearer ${token}`);
    await supertest(app).post(`/api/article/${data?.article?.slug}/unfavorite`).set('Authorization', `Bearer ${token}`);
    const result = await supertest(app)
      .get(`/api/article/${data?.article?.slug}`)
      .set('Authorization', `Bearer ${token}`);

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
          tags: ['test-tag'],
          author: {
            following: false,
            image: null,
            username: expect.any(String),
          },
        },
      },
      error: null,
      success: true,
    });
  });
});

describe('GET /api/articles - get article author', () => {
  let token = '';
  const TEST_API = `/api/articles`;
  const userId = 'user-get-author-articles';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should return data by using query', () => {
    it('author', async () => {
      await createArticles(token, {
        title: 'test-author-articles',
      });

      const result = await supertest(app).get(`${TEST_API}?limit=10&offset=0&author=${userId}`);
      expect(result.status).toEqual(200);
      expect(result.body.data.articlesCount).toEqual(1);
    });
  });
});
