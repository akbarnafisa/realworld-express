import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UserCheck } from './user.check';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserCheck],
  imports: [PrismaModule, AuthModule],
})
export class UserModule {}
