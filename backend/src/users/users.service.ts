import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password) {
            const salt = await bcrypt.genSalt(10);
            createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
        }
        const newUser = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(newUser);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt(10);
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }


        await this.usersRepository.update(id, updateUserDto);

        const updatedUser = await this.usersRepository.findOne({ where: { id } });


        const { ...userWithoutPassword } = updatedUser;


        return userWithoutPassword;
    }

    async deleteUser(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.usersRepository.delete(id);
    }


    async login(email: string, password: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new UnauthorizedException('Credenciales incorrectas');
        }
    
        const payload = { userId: user.id, email: user.email };
        return { access_token: this.jwtService.sign(payload) };
      }

}
