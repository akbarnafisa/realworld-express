import { tagsViewer, TagsType } from 'validator';
import { getTags } from '../../utils/db/tags';

const getTagsService = async () => {
  const tagsQuery = await getTags();
  const tags = tagsQuery?.rows as TagsType[];
  return tagsViewer(tags);
};

export default getTagsService;
