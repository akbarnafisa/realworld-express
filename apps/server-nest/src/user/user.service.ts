import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { UserCheck } from './user.check';
import { AuthService } from '@app/auth/auth.service';
import { ResponseUserWithTokenDto } from './dto/response-user-with-token.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthEntities } from '@app/auth/entities/auth.entities';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userCheck: UserCheck,
    private authService: AuthService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<ResponseUserWithTokenDto> {
    const { email, password, username } = createUserDto;
    await this.checkUniqueUser(email, username);
    const hashedPassword = this.authService.hashPassword(password);

    const userData = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      username,
    });

    return this.userWithTokenViewer(userData);
  }

  async getCurrentUser(auth: AuthEntities): Promise<ResponseUserDto> {
    const userData = await this.userRepository.getUserById(auth.id);
    this.userCheck.isExistUser(!!userData);
    return this.userViewer(userData);
  }

  private async checkUniqueUser(
    email: string,
    username: string,
  ): Promise<void> {
    const userExists = await this.userRepository.getUserByEmailOrName(
      email,
      username,
    );

    this.userCheck.isUniqueUser(!!userExists);
  }

  private userWithTokenViewer(createUserDto: UserEntity) {
    const token = this.authService.createUserToken({
      id: createUserDto.id,
      username: createUserDto.username,
      email: createUserDto.email,
    });
    return {
      user: {
        bio: createUserDto.bio,
        email: createUserDto.email,
        image: createUserDto.image,
        username: createUserDto.username,
        token,
      },
    };
  }

  private userViewer(createUserDto: UserEntity) {
    return {
      user: {
        bio: createUserDto.bio,
        email: createUserDto.email,
        image: createUserDto.image,
        username: createUserDto.username,
      },
    };
  }
}
