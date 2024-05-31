import { IProduct } from './products';

export interface ICartProduct extends IProduct {
  quantity?: number;
}
