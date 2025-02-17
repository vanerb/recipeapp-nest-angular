import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]),  JwtModule.register({
    secret: process.env.JWT_SECRET || 'secretKey',
    signOptions: { expiresIn: '1h' },
  }),],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}
