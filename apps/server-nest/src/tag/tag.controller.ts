import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagsResponseType } from 'validator';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('tags')
  async getTags(): Promise<TagsResponseType> {
    return await this.tagService.getTags();
  }
}
