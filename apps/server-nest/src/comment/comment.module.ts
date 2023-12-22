import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { AuthModule } from '@app/auth/auth.module';
import { CommentRepository } from './comment.repository';
import { CommentCheck } from './comment.check';
import { ArticleModule } from '@app/article/article.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, CommentCheck],
  imports: [PrismaModule, AuthModule, ArticleModule],
})
export class CommentModule {}
