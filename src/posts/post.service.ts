import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async createPost(post: createPostDto) {
    const userFound = await this.usersService.getUser(post.authorId);
    console.log('userFound', userFound);
    if (!userFound)
      return new HttpException('User not found', HttpStatus.NOT_FOUND);

    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  getPosts() {
    return this.postRepository.find({
      relations: ['author'],
    });
  }
}
