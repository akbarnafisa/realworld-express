import { web } from 'server-express-prisma-pzn/src/application/web';
import { prismaClient } from 'server-express-prisma-pzn/src/application/database';
import bcrypt from 'bcrypt';
import supertest from 'supertest';

export const app = web;
export const NOT_FOUND_USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjY1LCJ1c2VybmFtZSI6InRlc3RpZC11c2VybmFtZSIsImVtYWlsIjoidGVzdGlkQHRlc3RpZHouY29tIiwiaWF0IjoxNjk5MjQ1MjYwLCJleHAiOjE2OTk4NTAwNjB9.jgU6BSB0B9cx_oIsnJjogf-zTUvh6T0yBlle-soBWVg'

export const removeTestUser = async (id?: string) => {
  await prismaClient.user.deleteMany({
    where: {
      username: {
        contains: id ? id : 'testid',
      },
    },
  });
};

export const createTestUser = async (id?: string) => {
  try {
    const username = id ? `${id}` : 'testid-username';
    const email = id ? `${id}@testid.com` : 'testid@testid.com';

    const result = await prismaClient.user.create({
      data: {
        username,
        email,
        password: bcrypt.hashSync('password', 10),
      },
    });

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