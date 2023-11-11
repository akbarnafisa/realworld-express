import { type AnySchema, object, string } from 'yup';
import type { UserUpdateInputType } from './types';

const username = string().trim().required('Username is required').max(100, 'Username is too long');
const email = string().trim().required('Email is required').email('Invalid email').max(100, 'Email is too long');
const password = string().trim().max(50, 'Passowrd is too long');
const bio = string().trim().max(300, 'Bio is too long').nullable();
const image = string().trim().url('Invalid Image URL').max(1024, 'Image URL is too long').nullable();

export const userUpdateInputSchema = object<Record<keyof UserUpdateInputType, AnySchema>>({
  email,
  username,
  password,
  bio,
  image,
});
