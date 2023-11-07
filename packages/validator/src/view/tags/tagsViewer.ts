import { Tags } from '@prisma/client';

import type { TagsResponseType } from './type';

type tagsType = Tags & {
  _count: {
    articles: number;
  };
};

export const tagsViewer = (tags: tagsType[]): TagsResponseType => {
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
