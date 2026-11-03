import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { imageUpload } from 'src/common/uploads';
import { User } from 'src/users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll() {
    return this.postsService.getAll();
  }

  @Get('user/:id')
  getByUser(@Param('id') id: string) {
    return this.postsService.getByUser(id);
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageUpload('posts')))
  create(
    @Body() dto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File | undefined,
    @CurrentUser() user: User,
  ) {
    return this.postsService.create(dto, image, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.delete(id, user);
  }
}
