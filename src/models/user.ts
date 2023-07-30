import { model, Schema } from 'mongoose';
import {regExp} from "../constants";
import validator from "validator";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
      validate: {
          validator: (url: string) => regExp.test(url),
          message: 'Некорректная ссылка на аватар',
      },
  },
  email: {
    type: String,
    required: true,
    unique: true,
      validate: {
      validator: (value: string) => validator.isEmail(value),
          message: "Некорректный формат почты"
      }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default model<IUser>('user', userSchema);
