import { Tags } from '@prisma/client';

export class TagEntity implements Tags {
  id: number;
  name: string;
}

export class TagWithRelationEntity extends TagEntity {
  _count: {
    articles: number;
  };
}
