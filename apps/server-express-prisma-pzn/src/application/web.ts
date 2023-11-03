import express from 'express';
import { publicRouter } from '../routes/public';
import { privateRouter } from '../routes/private';

import { errorMiddleware } from '../middleware/errorMiddleware';
import { prismaErrorMiddleware } from '../middleware/prismaErrorMiddleware';


export const web = express();

web.use(express.json());
web.use(publicRouter);
web.use(privateRouter);

web.use(prismaErrorMiddleware, errorMiddleware)
