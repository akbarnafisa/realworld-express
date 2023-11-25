import { web } from 'server-express-prisma-relation/src/application/web';
import prismaApp from 'server-express-prisma/src/app';
import { app as rawApp } from 'server-express-prisma-raw/src/app/app';
import pool from 'server-express-prisma-raw/src/app/db';

require('dotenv').config();

import { prismaClient } from 'server-express-prisma-relation/src/application/database';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import { ArticleCreateInputType } from 'validator';
import { registerUser } from 'server-express-prisma-raw/src/utils/db/users';

const getCurrentApp = () => {
  switch (process.env.WORKSPACE) {
    case 'prisma':
      return prismaApp;
      break;
    case 'relation':
      return web;
      break;
    case 'raw':
      return rawApp;
      break;
    default:
      break;
  }
};

export let app = getCurrentApp();

export const NOT_FOUND_USER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Indvd0B3b3cuY29tIiwiaWQiOjUxLCJ1c2VybmFtZSI6IndvdyIsImlhdCI6MTcwMDg5NDQ0OSwiZXhwIjoxNzYxMzc0NDQ5fQ.Mk-YAIKdi3g0iuWPKsLp9wDQkt39vKCt_Rwq5rDkxMk';
export const removeTestUser = async (id?: string) => {
  const username = id ? id : 'testid';
  if (process.env.WORKSPACE === 'raw') {
    const query = 'DELETE FROM blog_user WHERE username ILIKE $1';
    const values = [`%${username}%`];
    await pool.query(query, values);
  } else {
    await prismaClient.user.deleteMany({
      where: {
        username: {
          contains: username,
        },
      },
    });
  }
};

export const createTestUser = async (id?: string) => {
  try {
    const username = id ? `${id}` : 'testid-username';
    const email = id ? `${id}@testid.com` : 'testid@testid.com';

    if (process.env.WORKSPACE === 'raw') {
      return await registerUser({
        email,
        password: 'password',
        username,
      });
    } else {
      return await prismaClient.user.create({
        data: {
          username,
          email,
          password: bcrypt.hashSync('password', 10),
        },
      });
    }
  } catch (error) {}
};

export const getToken = async (id: string) => {
  await createTestUser(id);

  const result = await supertest(app)
    .post('/api/users/login')
    .send({
      email: `${id}@testid.com`,
      password: 'password',
    });
  return result.body?.data?.user?.token;
};

export const createArticles = async (token: string, payload?: Partial<ArticleCreateInputType>) => {
  const result = await supertest(app)
    .post('/api/article')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'test-description',
      body: 'test-body',
      title: 'test-title',
      tagList: ['test-tag'],
      ...payload,
    });

  return result.body?.data;
};

export const createComment = async (slug: string, token: string, text: string) => {
  const result = await supertest(app)
    .post(`/api/article/${slug}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      body: `test-comment-${text}`,
    });

  return result.body?.data;
};

export const createComments = (slug: string, token: string) => {
  return Promise.all(
    Array(15)
      .fill('')
      .map(async (_, i) => {
        return await createComment(slug, token, String(i));
      }),
  );
};

export const removeTags = async (name = 'test-') => {
if (process.env.WORKSPACE === 'raw') {
  const query = 'DELETE FROM blog_tag WHERE name ILIKE $1';
  const values = [`%${name}%`];
  await pool.query(query, values);
} else {
  
  await prismaClient.tags.deleteMany({
    where: {
      name: {
        contains: name,
      },
    },
  });
}
};
