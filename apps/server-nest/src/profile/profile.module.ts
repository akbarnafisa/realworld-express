import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ProfileRepository } from './profile.repository';
import { ProfileCheck } from './profile.check';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, ProfileCheck],
  imports: [PrismaModule, AuthModule],
})
export class ProfileModule {}
