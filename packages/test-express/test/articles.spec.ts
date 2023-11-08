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

    it('favorite', async () => {
      const data = await createArticles(token, {
        title: 'test-articles-favorite',
      });

      await supertest(app).post(`/api/article/${data?.article?.slug}/favorite`).set('Authorization', `Bearer ${token}`);
      const result = await supertest(app).get(`${TEST_API}?limit=10&offset=0&favorited=${userId}`);
      expect(result.status).toEqual(200);
      expect(result.body.data.articlesCount).toEqual(1);
    });
  });
});
