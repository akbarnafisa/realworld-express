import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { AuthModule } from '@app/auth/auth.module';
import { ArticleRepository } from './article.repository';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
  imports: [PrismaModule, AuthModule],
})
export class ArticleModule {}
