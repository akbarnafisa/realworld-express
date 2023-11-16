import type { Request } from 'express';

const registerService = async (request: Request) => {
  console.log(request)
  return 'asoi';
};

export default registerService;
