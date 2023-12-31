import supertest from 'supertest';
import { app, getToken, removeTags, removeTestUser } from './utils';

describe('GET /api/tags', () => {
  let token = '';
  const TEST_API = '/api/tags';
  const userId = 'user-create-tags';

  beforeAll(async () => {
    token = await getToken(userId);
  });

  afterAll(async () => {
    await removeTestUser(userId);
    await removeTags('data-');
  });

  it('should return me tags data', async () => {
    await Promise.all([
      supertest(app)
        .post('/api/article')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'description',
          tagList: ['data-2'],
          body: 'body',
          title: 'title',
        }),
      supertest(app)
        .post('/api/article')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'description',
          tagList: ['data-2'],
          body: 'body',
          title: 'title',
        }),
      supertest(app)
        .post('/api/article')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'description',
          tagList: ['data-1'],
          body: 'body',
          title: 'title',
        }),
    ]);

    const result = await supertest(app).get(TEST_API);

    expect(result.body.data.tags).toBeTruthy();

    const tags = result.body.data.tags.filter((data: any) => data === 'data-1' || data === 'data-2');
    expect(result.body.data.tags).toBeTruthy();
    expect(tags).toEqual(['data-2', 'data-1']);

    expect(result.status).toEqual(200);
  });
});
