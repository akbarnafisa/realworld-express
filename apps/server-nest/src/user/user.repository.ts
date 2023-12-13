import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: RequestCreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        email: createUserDto.email,
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const data = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return data;
  }

  async getUserByEmailOrName(
    email: string,
    username: string,
  ): Promise<UserEntity> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
  }
}
