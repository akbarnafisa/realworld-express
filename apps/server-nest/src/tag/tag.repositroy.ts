import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  async getTags() {
    return await this.prisma.tags.findMany({
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
  }
}
