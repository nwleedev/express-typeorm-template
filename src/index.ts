import 'reflect-metadata';
import cors from 'cors';
import { createConnection } from 'typeorm';
import express from 'express';
import { router as UserRouter } from './controller/user';
import { router as PostRouter } from './controller/post';

createConnection()
  .then((db) => {
    const app = express();
    app.use(express.json());
    app.use(
      cors({
        origin: '*',
      }),
    );
    app.use(
      express.urlencoded({
        extended: false,
      }),
    );
    app.use('/user', UserRouter);
    app.use('/post', PostRouter);
    app.get('/', (req, res) => {
      res.status(200).json({
        message: 'Hello World!',
      });
      return;
    });
    app.listen(5000, () => console.log('The server is running on port 5000'));
  })
  .catch((error) => console.log(error));
