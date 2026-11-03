import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { User } from 'src/users/users.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('recipes/:id/comments')
  getByRecipe(@Param('id') id: string) {
    return this.commentsService.getByRecipe(id);
  }

  @Post('recipes/:id/comments')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(id, dto.text, user);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.delete(id, user);
  }
}
