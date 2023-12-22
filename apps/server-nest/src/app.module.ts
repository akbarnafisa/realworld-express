import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ArticleModule, TagModule, CommentModule, ProfileModule],
})
export class AppModule {}
