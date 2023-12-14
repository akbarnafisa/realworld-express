import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { UserEntity } from './entities/user.entity';
import { RequestUserUpdateDto } from './dto/request/request-update-user.dto';

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
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByEmailOrName(
    email: string,
    username: string,
  ): Promise<UserEntity | null> {
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

  async updateUser(id: number, updateUserDto: RequestUserUpdateDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }
}
