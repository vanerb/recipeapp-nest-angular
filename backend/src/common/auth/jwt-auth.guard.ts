import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Debes iniciar sesión');
    }

    let userId: string;
    try {
      ({ userId } = await this.jwtService.verifyAsync(token));
    } catch {
      throw new UnauthorizedException('La sesión ha caducado');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('La sesión ha caducado');
    }
    if (user.isBlocked) {
      throw new ForbiddenException('Tu cuenta está bloqueada');
    }
    request.user = user;
    return true;
  }
}
