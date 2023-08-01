import express, { Response, Request, NextFunction } from 'express';
import { errors } from 'celebrate';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import authMiddleware from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUserValidation, loginValidation } from './validation/validation';
import { AppError } from './utills';
import errorHandler from './middlewares/errorHandler';

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

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.use((_req: Request, _res: Response, next: NextFunction) => next(AppError.NotFound('Страница не найдена')));

app.listen(3000, () => {
  console.log('Сервер работает http://127.0.0.1:3000');
});
