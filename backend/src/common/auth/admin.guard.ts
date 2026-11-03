import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isAdmin } from 'src/users/users.entity';

// Va siempre detrás de JwtAuthGuard, que es quien rellena request.user
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user || !isAdmin(user)) {
      throw new ForbiddenException('Solo para administración');
    }
    return true;
  }
}
