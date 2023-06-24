import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  // GET /users METHOD
  getUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile', 'posts'],
    });
  }

  // GET /users/:id METHOD
  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'posts'],
    });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  // DELETE /users/:id METHOD
  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  // CREATE /users METHOD
  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (userFound) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  // PATCH /users/:id METHOD
  async updateUser(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updateUser = Object.assign(userFound, user);
    return this.userRepository.save(updateUser);
  }

  //CREATE PROFILE /users/:id/profile METHOD
  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newProfile = await this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);

    userFound.profile = savedProfile;
    return this.userRepository.save(userFound);
  }
}
