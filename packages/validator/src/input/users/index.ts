import { type AnySchema, object, string } from 'yup';
import type {
  UserRegisterInputType,
  UserLoginInputType,
} from "./types"

const username = string().trim().required('Username is required').max(100, 'Username is too long')
const email = string().trim().required('Email is required').email('Invalid email').max(100, 'Email is too long')
const password = string().trim().max(100, "Passowrd is too long")
const passwordRequired = password.required("Password is required")

export const usersRegisterInputSchema = object<Record<keyof UserRegisterInputType, AnySchema>>({
  email,
  username,
  password: passwordRequired
})

export const usersLoginInputSchema = object<Record<keyof UserLoginInputType, AnySchema>>({
  email,
  password: passwordRequired
})
