import { web } from 'server-express-prisma-pzn/src/application/web';
import { prismaClient } from 'server-express-prisma-pzn/src/application/database';
import bcrypt from 'bcrypt';

export const app = web;

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: {
        contains: 'testid',
      },
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'testid-username',
      email: 'testid@testid.com',
      password: await bcrypt.hash('password', 10),
    },
  });
};
