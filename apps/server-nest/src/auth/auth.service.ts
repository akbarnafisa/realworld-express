import { UserEntity } from '@app/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthEntities } from './entities/auth.entities';

@Injectable()
export class AuthService {
  private authData: AuthEntities | undefined;

  hashPassword(password: string) {
    console.log({
      bcrypt,
    });
    return bcrypt.hashSync(password, 10);
  }

  createUserToken(user: Pick<UserEntity, 'id' | 'email' | 'username'>) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      this.getSecretKey(),
      {
        expiresIn: '7d',
      },
    );
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.getSecretKey(), {
      algorithms: ['HS256'],
    });
  }

  getToken(auth: string | undefined, isRequired: boolean) {
    if (!isRequired) {
      const token = auth?.split('Bearer ')[1] || '';
      if (!token) {
        return null;
      }

      return this.verifyToken(token) as AuthEntities;
    }

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException(
        'No authorization token was found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = auth.split('Bearer ')[1];

    const payload = this.verifyToken(token) as AuthEntities;

    if (!payload || !payload.id || !payload.email || !payload.username) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }

  checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  setAuthData(data: AuthEntities) {
    this.authData = data;
  }

  getAuthData<T extends boolean>(
    isRequired: T,
  ): T extends true ? AuthEntities : AuthEntities | undefined {
    if (isRequired && this.authData === undefined) {
      throw new HttpException(
        'No authorization token was found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authData as T extends true
      ? AuthEntities
      : AuthEntities | undefined;
  }

  private getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET missing in environment');
    }

    return secret;
  }
}
