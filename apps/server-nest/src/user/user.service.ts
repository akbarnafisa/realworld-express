import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { UserCheck } from './user.check';
import { AuthService } from '@app/auth/auth.service';
import { ResponseUserWithTokenDto } from './dto/response/response-user-with-token.dto';
import { ResponseUserDto } from './dto/response/response-user.dto';
import { RequestLoginUserDto } from './dto/request/request-login-user.dto';
import { RequestUserUpdateDto } from './dto/request/request-update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userCheck: UserCheck,
    private authService: AuthService,
  ) {}

  async create(
    createUserDto: RequestCreateUserDto,
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

  async login(
    loginUserDto: RequestLoginUserDto,
  ): Promise<ResponseUserWithTokenDto> {
    const { email, password } = loginUserDto;
    const userData = await this.userRepository.getUserByEmail(email);

    if (!userData) {
      throw new HttpException(
        'Email or password is not correct!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = this.authService.checkPassword(
      password,
      userData.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Email or password is not correct!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.userWithTokenViewer(userData);
  }

  async getCurrentUser(): Promise<ResponseUserDto> {
    const auth = this.authService.getAuthData(true);

    const userData = await this.userRepository.getUserById(auth.id);

    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.userViewer(userData);
  }

  async updateUser(
    updateUserDto: RequestUserUpdateDto,
  ): Promise<ResponseUserDto> {
    const auth = this.authService.getAuthData(true);

    const { password, ...restInput } = updateUserDto;
    const currentUserData = await this.userRepository.getUserById(auth.id);

    if (!currentUserData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedData = await this.userRepository.updateUser(auth.id, {
      ...restInput,
      password: password ? this.authService.hashPassword(password) : undefined,
    });

    return this.userWithTokenViewer(updatedData);
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
