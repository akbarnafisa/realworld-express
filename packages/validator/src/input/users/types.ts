export interface UserRegisterInputType {
  email: string;
  password: string;
  username: string;
}

export interface UserLoginInputType {
  email: string;
  password: string;
}


export interface TokenPayload {
  id: number,
  username: string
  email: string
}