import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@Body() post: createPostDto) {
    return this.postService.createPost(post);
  }

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }
}
