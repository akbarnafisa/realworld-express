import { UseYupSchema } from '@app/common/common.decorator';
import { CommentInputType } from 'validator';
import { type AnySchema, object, string } from 'yup';

export const commentInputSchema = object<
  Record<keyof CommentInputType, AnySchema>
>({
  body: string()
    .trim()
    .required('Comment content is required')
    .max(65535, 'Comment content is too long'),
});

@UseYupSchema(commentInputSchema)
export class RequestCreateCommentDto implements CommentInputType {
  body: string;
}
