import express, {Response, Request, NextFunction} from 'express';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';
import { createUser, getCurrentUser, login } from './controllers/users';
import authMiddleware from './middlewares/auth';
import { requestLogger } from "./middlewares/logger";
import errorMiddleware from './middlewares/error';
import {STATUS_NOT_FOUND} from "./constants/statusCodes";

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

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);
app.use(authMiddleware);
app.get('/users/me', getCurrentUser);

app.use('/', userRouter);
app.use('/', cardsRouter);

app.use(errorMiddleware)

app.use((req: Request, res: Response, next: NextFunction) => {
  next({ status: STATUS_NOT_FOUND, message: 'Страница не найдена' });
});

app.listen(3000, () => {
  console.log('Сервер работает http://127.0.0.1:3000');
});
