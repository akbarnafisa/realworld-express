import { prismaClient } from '../../application/database';
import { tagsViewer } from 'validator';

export const getTagssService = async () => {
  const tags = await prismaClient.tags.findMany({
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
    skip: 0,
    take: 10,
    orderBy: { articles: { _count: 'desc' } },
  });

  return tagsViewer(tags);
};
