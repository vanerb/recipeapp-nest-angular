import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { User } from 'src/users/users.entity';
import { RateRecipeDto } from './dto/rate-recipe.dto';
import { RatingsService } from './ratings.service';

@Controller('recipes/:id/rating')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  getMine(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ratingsService.getMine(id, user);
  }

  @Put()
  rate(
    @Param('id') id: string,
    @Body() dto: RateRecipeDto,
    @CurrentUser() user: User,
  ) {
    return this.ratingsService.rate(id, dto.value, user);
  }
}
