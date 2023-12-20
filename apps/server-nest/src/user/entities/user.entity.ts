import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  bio: string | null;
  email: string;
  image: string | null;
  password: string;
  username: string;
}

export class UserArticle implements Pick<User, 'username' | 'image'> {
  image: string | null;
  username: string;
}
