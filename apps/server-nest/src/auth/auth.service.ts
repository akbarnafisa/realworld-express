import { UserEntity } from '@app/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthEntities } from './entities/auth.entities';

@Injectable()
export class AuthService {
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
    }) as unknown as AuthEntities;
  }

  getToken(auth: string | undefined) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException(
        'No authorization token was found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = auth.split('Bearer ')[1];

    const payload = this.verifyToken(token);

    if (!payload || !payload.id || !payload.email || !payload.username) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }

  checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  private getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET missing in environment');
    }

    return secret;
  }
}
