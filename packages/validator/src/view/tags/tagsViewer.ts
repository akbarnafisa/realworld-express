import { Tags } from '@prisma/client';

import type { TagsResponseType } from './type';

export type TagsType = Tags & {
  _count: {
    articles: number;
  };
};

export const tagsViewer = (tags: TagsType[]): TagsResponseType => {
  return {
    tags: tags
      .filter((tag) => {
        return tag._count.articles > 0;
      })
      .map((tag) => {
        return tag.name;
      }),
  };
};
