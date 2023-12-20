import { UseYupSchema } from '@app/common/common.decorator';
import { ArticleCreateInputType } from 'validator';
import { type AnySchema, object, string, array } from 'yup';

export const articleInputSchema = object<
  Record<keyof ArticleCreateInputType, AnySchema>
>({
  title: string()
    .trim()
    .required('Title is required')
    .max(100, 'Title is too long'),
  description: string()
    .trim()
    .required('Description is required')
    .max(255, 'Description is too long'),
  body: string()
    .trim()
    .required('Article content is required')
    .max(65535, 'Article content is too long'),
  tagList: array(
    string().trim().required('Tag is required').max(100, 'Tag is too long'),
  )
    .min(1, 'Add at least one tag')
    .required(),
});

@UseYupSchema(articleInputSchema)
export class RequestCreateArticleDto implements ArticleCreateInputType {
  body: string; // String!
  description: string; // String!
  tagList: string[]; // [String!]!
  title: string; // String!
}
