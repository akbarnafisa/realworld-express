import express from 'express';
import cors from 'cors';
import publicRoutes from '../routes/public';
import generalError from '../middleware/generalError';
import dbError from '../middleware/dbError';

export const app = express();

app.use(express.json());
app.use(cors());

app.use(publicRoutes);

app.use(dbError, generalError);

