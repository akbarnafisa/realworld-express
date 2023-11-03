import { ResponseError } from '../error';
import type { AnySchema } from 'yup';

export const validate = async <T>(schema: AnySchema, request: Request)=> {
  try {
    const result = await schema.validate(request, {
      abortEarly: false,
    });
    return result as T;
  } catch (error: any) {
    if (error.errors.length > 1) {
      throw new ResponseError(400, `${error.errors.join(', ')}`);
    } else {
      throw new ResponseError(400, error.message);
    }
  }
};
