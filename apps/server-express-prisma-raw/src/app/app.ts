import express from 'express';
import cors from 'cors';
import publicRoutes from '../routes/public';
import privateRoutes from '../routes/private';
import generalError from '../middleware/generalError';
import dbError from '../middleware/dbError';

export const app = express();

app.use(express.json());
app.use(cors());

app.use(publicRoutes);
app.use(privateRoutes);

app.use(dbError, generalError);
