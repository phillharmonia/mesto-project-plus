import { model, Schema, Types } from 'mongoose';
import {regExp} from "../constants";

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Types.ObjectId];
  createdAt: Date;
}

const CardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
      validate: {
          validator: (url: string) => regExp.test(url),
          message: 'Некорректная ссылка',
      },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    default: [],
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default model<ICard>('card', CardSchema);
