import supertest from 'supertest';
import { app, removeTestUser, getToken, createArticles, NOT_FOUND_USER_TOKEN, removeTags } from './utils';

describe('GET /api/articles - get article', () => {
  let token = '';
  const TEST_API = `/api/articles`;
  const userId = 'user-get-articles';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  it('should return articles data', async () => {
    await createArticles(token, {
      title: 'test-articles-1',
    });
    await createArticles(token, {
      title: 'test-articles-2',
    });
    const result = await supertest(app).get(TEST_API);
    const data = result.body.data.articles.filter((article: any) => article.title.includes('test-articles-'));
    expect(result.status).toEqual(200);
    expect(data).toEqual([
      {
        authorId: expect.any(Number),
        body: 'test-body',
        createdAt: expect.any(String),
        description: 'test-description',
        favorited: false,
        favoritesCount: 0,
        id: expect.any(Number),
        slug: expect.any(String),
        tags: expect.any(Array),
        title: 'test-articles-2',
        updatedAt: expect.any(String),
        author: {
          following: false,
          image: null,
          username: expect.any(String),
        },
      },
      {
        authorId: expect.any(Number),
        body: 'test-body',
        createdAt: expect.any(String),
        description: 'test-description',
        favorited: false,
        favoritesCount: 0,
        id: expect.any(Number),
        slug: expect.any(String),
        tags: expect.any(Array),
        title: 'test-articles-1',
        updatedAt: expect.any(String),
        author: {
          following: false,
          image: null,
          username: expect.any(String),
        },
      },
    ]);
  });

  describe('should return data by using query', () => {
    it('article favorite', async () => {
      const data = await createArticles(token, {
        title: 'test-articles-favorite',
      });

      await supertest(app).post(`/api/article/${data?.article?.slug}/favorite`).set('Authorization', `Bearer ${token}`);
      const result = await supertest(app).get(`/api/articles?limit=10&offset=0&favorited=${userId}`);
      expect(result.status).toEqual(200);
      expect(result.body.data.articlesCount).toEqual(1);
    });

    it('tag', async () => {
      await createArticles(token, {
        title: 'user-articles-tags1',
        tagList: ['user-articles-tags', 'user-articles-tags-1'],
      });

      await createArticles(token, {
        title: 'user-articles-tags2',
        tagList: ['user-articles-tags', 'user-articles-tags-2'],
      });

      const result = await supertest(app).get(`${TEST_API}?limit=10&offset=0&tag=user-articles-tags`);
      expect(result.status).toEqual(200);
      expect(result.body.data.articlesCount).toEqual(2);

      await removeTags('user-articles-tags');
    });

    it('cursor', async () => {
      await Promise.all([
        createArticles(token, {
          title: 'test-articles-1',
        }),
        createArticles(token, {
          title: 'test-articles-2',
        }),
      ]);
      const resultPage1 = await supertest(app).get(`${TEST_API}?limit=1`);
      const resultPage2 = await supertest(app).get(
        `${TEST_API}?limit=1&cursor=${resultPage1.body.data.articles[0].id}`,
      );
      const resultPage3 = await supertest(app).get(`${TEST_API}?limit=100&cursor=${resultPage2.body.data.nextCursor}`);
      expect(resultPage2.body.data.nextCursor).toBeTruthy();
      expect(resultPage2.body.data.hasMore).toEqual(true);

      expect(resultPage3.body.data.nextCursor).toEqual(null);
      expect(resultPage3.body.data.hasMore).toEqual(false);
    });

    it('limit', async () => {
      await Promise.all([
        createArticles(token, {
          title: 'test-articles-1',
        }),
        createArticles(token, {
          title: 'test-articles-2',
        }),
      ]);
      const result = await supertest(app).get(`${TEST_API}?limit=1&offset=0`);
      expect(result.status).toEqual(200);
      expect(result.body.data.articles.length).toEqual(1);
      expect(result.body.data.articlesCount > 1).toEqual(true);
    });

    it('offset', async () => {
      await Promise.all([
        createArticles(token, {
          title: 'test-articles-1',
        }),
        createArticles(token, {
          title: 'test-articles-2',
        }),
      ]);
      const result = await supertest(app).get(`${TEST_API}?limit=10&offset=100`);
      expect(result.status).toEqual(200);
      expect(result.body.data.articles.length).toEqual(0);
      expect(result.body.data.articlesCount > 1).toEqual(true);
    });
  });
});

describe('GET /api/feed - get article', () => {
  let token = '';
  let secondToken = '';
  const TEST_API = `/api/feed`;
  const userId = 'user-feed-article';
  const secondUserId = 'user-feed-article-2';

  beforeAll(async () => {
    token = await getToken(userId);
    secondToken = await getToken(secondUserId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
    await removeTestUser(secondUserId);
  });

  it('should error if no token provided', async () => {
    const result = await supertest(app).get(TEST_API);

    expect(result.status).toEqual(401);
    expect(result.body).toEqual({
      data: null,
      error: {
        errorMsg: 'No authorization token was found',
      },
      success: false,
    });
  });

  it('should return empty array in user not follow anyone', async () => {
    const result = await supertest(app).get(TEST_API).set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);
    expect(result.body.data.articles.length).toEqual(0);
    expect(result.body.data.articlesCount).toEqual(0);
  });

  it('should return feeds data', async () => {
    await createArticles(token);
    await createArticles(secondToken);

    await supertest(app).post(`/api/user/${secondUserId}/follow`).set('Authorization', `Bearer ${token}`);

    const result = await supertest(app).get(TEST_API).set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);
    expect(result.body.data.articles.length).toEqual(1);
    expect(result.body.data.articlesCount).toEqual(1);
  });

  it('cursor', async () => {
    await createArticles(secondToken, {
      title: 'test-articles-1',
    })
    await createArticles(secondToken, {
      title: 'test-articles-2',
    })
    await supertest(app).post(`/api/user/${secondUserId}/follow`).set('Authorization', `Bearer ${token}`)
    

    const resultPage1 = await supertest(app).get(`${TEST_API}?limit=1`).set('Authorization', `Bearer ${token}`);
    const resultPage2 = await supertest(app)
      .get(`${TEST_API}?limit=1&cursor=${resultPage1.body.data.articles[0].id}`)
      .set('Authorization', `Bearer ${token}`);
    const resultPage3 = await supertest(app)
      .get(`${TEST_API}?limit=100&cursor=${resultPage2.body.data.nextCursor}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resultPage2.body.data.nextCursor).toBeTruthy();
    expect(resultPage2.body.data.hasMore).toEqual(true);

    expect(resultPage3.body.data.nextCursor).toEqual(null);
    expect(resultPage3.body.data.hasMore).toEqual(false);
  });
});
