import { IPagination, ISorting } from './baseTypes';
import { ICategory } from './categories';

export interface IProduct {
  id: string;
  name: string;
  photo?: string;
  desc?: string;
  createdAt: Date;
  updatedAt: Date;
  oldPrice?: number;
  price: number;
  category: ICategory;
}

export interface IProductsResponse {
  data: IProduct[];
  pagination: IPagination;
  sorting: ISorting;
}

export interface IProductRequest {
  name: string;
  photo?: string;
  desc?: string;
  oldPrice?: number;
  price: number;
  categoryId: string;
}
