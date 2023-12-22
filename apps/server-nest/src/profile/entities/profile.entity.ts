import { User } from '@prisma/client';
export class ProfileEntity implements User {
  id: number;
  bio: string | null;
  email: string;
  image: string | null;
  password: string;
  username: string;
}

export class ProfileWithRelationEntity {
  data: ProfileEntity | null;
  following: boolean;
}
