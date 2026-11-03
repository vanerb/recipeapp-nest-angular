import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/auth/admin.guard';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { User } from 'src/users/users.entity';
import { AdminService } from './admin.service';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserAdminDto,
    @CurrentUser() admin: User,
  ) {
    return this.adminService.updateUser(id, dto, admin);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @CurrentUser() admin: User) {
    return this.adminService.deleteUser(id, admin);
  }

  @Get('comments')
  getComments() {
    return this.adminService.getComments();
  }
}
