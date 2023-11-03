import bcrypt from 'bcrypt';

const saltRounds = 10;

export default function hashPassword (password: string) {
  return bcrypt.hashSync(password, saltRounds);
}
