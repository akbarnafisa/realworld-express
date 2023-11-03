export interface UserAuthResponseType {
  user: { email: string; token: string; username: string; bio: string | null; image: string | null };
}
