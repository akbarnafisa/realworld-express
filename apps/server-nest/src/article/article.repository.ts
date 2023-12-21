import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { ArticleWithRelationEntity } from './entities/article.entity';
import * as slug from 'slug';

const slugify = (title: string): string => {
  return `${slug(title, { lower: true })}-${(
    (Math.random() * Math.pow(36, 6)) |
    0
  ).toString(36)}`;
};

const articleIncludes = (userId: number | undefined) => {
  return {
    author: {
      select: {
        followedBy: userId
          ? {
              where: {
                followerId: userId,
              },
            }
          : undefined,
        username: true,
        image: true,
      },
    },
    favoritedBy: {
      where: {
        userId: userId,
      },
    },
    tags: {
      select: {
        tag: true,
      },
    },
    _count: {
      select: {
        favoritedBy: true,
      },
    },
  };
};

console.log(articleIncludes);

@Injectable()
export class ArticleRepository {
  constructor(private prisma: PrismaService) {}
  async createUser(
    userId: number,
    { body, description, title, tagList }: RequestCreateArticleDto,
  ): Promise<ArticleWithRelationEntity> {
    const data = this.prisma.article.create({
      data: {
        body,
        description,
        title,
        slug: slugify(title),
        author: { connect: { id: userId } },
        tags: {
          create: tagList.map((name: string) => {
            return {
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            };
          }),
        },
      },
      include: articleIncludes(userId),
    });

    console.log({
      data,
      body,
      description,
      title,
      tagList,
    });

    return data;
  }
}
