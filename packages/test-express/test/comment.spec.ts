import supertest from 'supertest';
import { app, removeTestUser, createComments, getToken, createArticles } from './utils';

describe('POST /api/article/:slug/comments - create comments', () => {
  let token = '';
  const TEST_API = (slug: string) => `/api/article/${slug}/comments`;
  const userId = 'user-create-comment';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).post(TEST_API('123')).send({
        body: '12345',
      });
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
      const result = await supertest(app).post(TEST_API('123')).set('Authorization', `Bearer ${token}`).send({
        body: '12345',
      });
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Article not found!',
        },
        success: false,
      });
    });

    it('should error if no comment body', async () => {
      const data = await createArticles(token);

      const result = await supertest(app).post(TEST_API(data?.article?.slug)).set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Comment content is required',
        },
        success: false,
      });
    });
  });

  it('should allow me to create comment', async () => {
    const data = await createArticles(token);

    const result = await supertest(app)
      .post(TEST_API(data?.article?.slug))
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: 'test-comment',
      });
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        comment: {
          body: 'test-comment',
          createdAt: expect.any(String),
          id: expect.any(Number),
          updatedAt: expect.any(String),
          user: {
            image: null,
            username: 'user-create-comment',
          },
        },
      },
    });
  });
});

describe('GET /api/article/:slug/comments - get comments', () => {
  let token = '';
  const userId = 'user-get-comment';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  it('should give me article by using pagination page one', async () => {
    const article = await createArticles(token);
    const slug = article?.article?.slug;
    await createComments(slug, token);
    const comment = await supertest(app).get(`/api/article/${slug}/comments?limit=5`);
    expect(comment.status).toEqual(200);
    expect(comment.body.data.comments.length).toEqual(5);
    expect(comment.body).toEqual({
      data: {
        comments: Array(5)
          .fill('')
          .map(() => ({
            body: expect.stringContaining('test-comment-'),
            createdAt: expect.any(String),
            id: expect.any(Number),
            updatedAt: expect.any(String),
            user: {
              image: null,
              username: userId,
            },
          })),
        commentsCount: 15,
      },
    });
  });

  it('should give me article by using pagination page two', async () => {
    const article = await createArticles(token);
    const slug = article?.article?.slug;
    await createComments(slug, token);
    const comment = await supertest(app).get(`/api/article/${slug}/comments?limit=10&offset=10`);
    expect(comment.status).toEqual(200);
    expect(comment.body.data.comments.length).toEqual(5);
    expect(comment.body).toEqual({
      data: {
        comments: Array(5)
          .fill('')
          .map(() => ({
            body: expect.stringContaining('test-comment-'),
            createdAt: expect.any(String),
            id: expect.any(Number),
            updatedAt: expect.any(String),
            user: {
              image: null,
              username: userId,
            },
          })),
        commentsCount: 15,
      },
    });
  });

  it('should give me article by using cursor', async () => {
    const article = await createArticles(token);
    const slug = article?.article?.slug;
    await createComments(slug, token);

    const resultPage1 = await supertest(app)
      .get(`/api/article/${slug}/comments?limit=1`)
      .set('Authorization', `Bearer ${token}`);
    const resultPage2 = await supertest(app)
      .get(`/api/article/${slug}/comments?limit=1&cursor=${resultPage1.body.data.comments[0].id}`)
      .set('Authorization', `Bearer ${token}`);
    const resultPage3 = await supertest(app)
      .get(`/api/article/${slug}/comments?limit=20&cursor=${resultPage2.body.data.nextCursor}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resultPage2.body.data.nextCursor).toBeTruthy();
    expect(resultPage2.body.data.hasMore).toEqual(true);

    expect(resultPage3.body.data.nextCursor).toEqual(null);
    expect(resultPage3.body.data.hasMore).toEqual(false);
  });
});

describe('DELETE /api/article/:slug/comments/:commentId - delete comment', () => {
  let token = '';
  const TEST_API = (slug: string, commentId: string) => `/api/article/${slug}/comments/${commentId}`;
  const userId = 'user-delete-comment';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
  });

  describe('should error ', () => {
    it('if user not logged in', async () => {
      const result = await supertest(app).delete(TEST_API('123', '123')).send({
        body: '12345',
      });
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
      const result = await supertest(app).delete(TEST_API('123', '123')).set('Authorization', `Bearer ${token}`).send({
        body: '12345',
      });
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Article not found!',
        },
        success: false,
      });
    });

    it('if comment not found', async () => {
      const data = await createArticles(token);
      const result = await supertest(app)
        .delete(TEST_API(data?.article?.slug, '123'))
        .set('Authorization', `Bearer ${token}`)
        .send({
          body: '12345',
        });
      expect(result.status).toEqual(404);
      expect(result.body).toEqual({
        data: null,
        error: {
          errorMsg: 'Comment not found!',
        },
        success: false,
      });
    });
  });

  it('should allow me to delete my comment', async () => {
    const article = await createArticles(token);
    const comment = await supertest(app)
      .post(`/api/article/${article?.article?.slug}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: 'test-comment',
      });

    const result = await supertest(app)
      .delete(TEST_API(article?.article?.slug, comment.body.data.comment.id))
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: '12345',
      });

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      data: {
        success: true,
      },
    });
  });
});
