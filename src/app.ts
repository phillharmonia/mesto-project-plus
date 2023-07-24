import express, { NextFunction, Response } from 'express';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';
import { IRequest } from './types/Request';

const mongoose = require('mongoose');

const databaseURL = 'mongodb://127.0.0.1:27017/mestodb';

mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log('Соединение с MongoDB установлено'))
  .catch((err: string) => console.error('Ошибка подключения к MongoDB:', err));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: IRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '64bcf33815d8393dc073f592',
  };
  next();
});
app.use('/', userRouter);
app.use('/', cardsRouter);

app.listen(3000, () => {
  console.log('Сервер работает http://127.0.0.1:3000');
});
