import {
  CanActivate,
  HttpStatus,
  ExecutionContext,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;

    this.isTokenExist(!!tokenString);

    try {
      request.auth = this.authService.getToken(tokenString);
      return true;
    } catch (error) {
      throw new HttpException(
        'Token expired or incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private isTokenExist(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
