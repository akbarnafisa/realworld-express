import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagRepository } from './tag.repositroy';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
  imports: [PrismaModule],
})
export class TagModule {}

