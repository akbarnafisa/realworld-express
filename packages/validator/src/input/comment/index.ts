import { type AnySchema, object, string } from 'yup';
import type { CommentInputType } from './types';

export const commentInputSchema = object<Record<keyof CommentInputType, AnySchema>>({
  body: string().trim().required('Comment content is required').max(65535, 'Comment content is too long'),
});
