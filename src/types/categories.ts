import { IPagination, ISorting } from './baseTypes';

export interface ICategory {
  id: string;
  name: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoriesResponse {
  data: ICategory[];
  pagination: IPagination;
  sorting: ISorting;
}

export interface ICategoryRequest {
  name: string;
  photo?: string;
}
