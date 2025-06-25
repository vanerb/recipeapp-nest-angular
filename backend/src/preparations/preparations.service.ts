import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';
import { Image } from 'src/images/images.entity';
import { Recipe } from 'src/recipes/recipes.entity';

@Injectable()
export class PreparationsService {
    constructor(
        @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
        @InjectRepository(Category) private cateoriesRepository: Repository<Category>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
    ) { }

}
