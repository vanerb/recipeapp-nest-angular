import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { UserRole } from 'src/users/users.entity';

export class UpdateUserAdminDto {
  @IsIn(['user', 'admin'])
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
