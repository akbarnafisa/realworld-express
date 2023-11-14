import express from 'express';
import usersRoute from './routes/api/users';
import userRoute from './routes/api/user';
import tagsRouter from './routes/api/tags';
import articlesRouter from './routes/api/articles';
import cors from 'cors'

import { generalErrorHandler, prismaErrorHandler } from './middleware/errorHandling';


const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/users', usersRoute);
app.use('/api/user', userRoute);
app.use("/api/tags", tagsRouter);
app.use("/api/article", articlesRouter);

app.get('/', (_req, res) => {
  return res.send('hello world');
});

app.use(prismaErrorHandler, generalErrorHandler);

export default app;
