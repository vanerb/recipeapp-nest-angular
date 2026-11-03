import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { removeUpload } from 'src/common/uploads';
import { Post } from 'src/posts/posts.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { isAdmin, User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    private jwtService: JwtService,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  // Objeto plano: así el serializador no quita el correo, que solo ve su dueño
  toPrivate(user: User) {
    const { id, name, email, role, bio, avatar, createdAt } = user;
    return { id, name, email, role, bio, avatar, createdAt };
  }

  async getProfile(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const [recipesCount, postsCount, rating] = await Promise.all([
      this.recipesRepository.countBy({ user: { id } }),
      this.postsRepository.countBy({ userId: id }),
      this.ratingsRepository
        .createQueryBuilder('rating')
        .innerJoin('rating.recipe', 'recipe')
        .select('AVG(rating.value)', 'average')
        .where('recipe.userId = :id', { id })
        .getRawOne<{ average: string | null }>(),
    ]);

    return Object.assign(user, {
      recipesCount,
      postsCount,
      averageRating: rating?.average ? +(+rating.average).toFixed(1) : 0,
    });
  }

  async createUser(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    if (await this.usersRepository.existsBy({ email })) {
      throw new ConflictException('Ya existe una cuenta con ese correo');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.save(
      this.usersRepository.create({ ...dto, email, password }),
    );
    return this.toPrivate(user);
  }

  async updateUser(
    user: User,
    dto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    const { currentPassword, ...changes } = dto;

    if (changes.password) {
      const stored = await this.usersRepository.findOne({
        where: { id: user.id },
        select: ['id', 'password'],
      });
      if (
        !currentPassword ||
        !(await bcrypt.compare(currentPassword, stored!.password))
      ) {
        throw new BadRequestException('La contraseña actual no es correcta');
      }
      changes.password = await bcrypt.hash(changes.password, 10);
    }

    if (changes.email) {
      changes.email = changes.email.toLowerCase();
      const owner = await this.usersRepository.findOneBy({
        email: changes.email,
      });
      if (owner && owner.id !== user.id) {
        throw new ConflictException('Ya existe una cuenta con ese correo');
      }
    }

    const patch: Partial<User> = { ...changes };
    if (avatar) {
      patch.avatar = `/uploads/avatars/${avatar.filename}`;
      await removeUpload(user.avatar);
    }
    if (Object.keys(patch).length > 0) {
      await this.usersRepository.update(user.id, patch);
    }

    return this.toPrivate((await this.findById(user.id))!);
  }

  // Quien sea la última cuenta de administración no puede darse de baja
  async deleteOwnAccount(user: User) {
    if (isAdmin(user)) {
      const admins = await this.usersRepository.countBy({ role: 'admin' });
      if (admins === 1) {
        throw new BadRequestException(
          'Eres la única cuenta de administración: nombra a otra persona antes de irte',
        );
      }
    }
    await this.deleteUser(user);
  }

  async deleteUser(user: User) {
    const [recipes, posts] = await Promise.all([
      this.recipesRepository.find({
        where: { user: { id: user.id } },
        relations: ['images'],
      }),
      this.postsRepository.findBy({ userId: user.id }),
    ]);
    await this.usersRepository.delete(user.id);

    const files = [
      user.avatar,
      ...recipes.flatMap((recipe) => recipe.images.map((image) => image.url)),
      ...posts.map((post) => post.image),
    ];
    await Promise.all(files.map((file) => removeUpload(file)));
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'password', 'isBlocked'],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if (user.isBlocked) {
      throw new ForbiddenException('Tu cuenta está bloqueada');
    }

    const payload = { userId: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
