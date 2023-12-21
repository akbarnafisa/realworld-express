import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repositroy';
import { TagWithRelationEntity } from './entities/tag.entity';
import { TagsResponseType } from 'validator';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}
  async getTags() {
    const tagsData = await this.tagRepository.getTags();
    return this.tagsViewer(tagsData);
  }

  private tagsViewer(tags: TagWithRelationEntity[]): TagsResponseType {
    return {
      tags: tags
        .filter((tag) => {
          return tag._count.articles > 0;
        })
        .map((tag) => {
          return tag.name;
        }),
    };
  }
}
