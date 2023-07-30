import express, {Response, Request, NextFunction} from 'express';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';
import { createUser, getCurrentUser, login } from './controllers/users';
import authMiddleware from './middlewares/auth';
import {errorLogger, requestLogger} from "./middlewares/logger";
import {createUserValidation, loginValidation} from "./validation/validation";
import {NotFoundError} from "./utills";
import {errors} from "celebrate";

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

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger)
app.use(errors());

app.use((req: Request, res: Response, next: NextFunction) => {
    return next(new NotFoundError('Страница не найдена'))
});

app.listen(3000, () => {
  console.log('Сервер работает http://127.0.0.1:3000');
});
