import { Request } from 'express-jwt';

const getCurrentUserService = (req: Request) => {
  console.log(req);
};

export default getCurrentUserService;
