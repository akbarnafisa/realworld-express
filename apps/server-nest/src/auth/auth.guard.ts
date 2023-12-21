import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
class BaseGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly isRequired: boolean,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;

    this.isRequired && this.isTokenExist(!!tokenString);

    try {
      const token = this.authService.getToken(tokenString, this.isRequired);
      if (!token && !this.isRequired) {
        return true;
      }

      token && this.authService.setAuthData(token);
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

@Injectable()
export class AuthGuard extends BaseGuard {
  constructor(authService: AuthService) {
    super(authService, true);
  }

  async canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

@Injectable()
export class OptionalAuthGuard extends BaseGuard {
  constructor(authService: AuthService) {
    super(authService, false);
  }

  async canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
