import { applySnapshot, flow, getParent, getSnapshot, types } from 'mobx-state-tree';
import { makeQuery } from '../api';
import { ICategoriesResponse, ICategory, ICategoryRequest } from '../types/categories';
import { IErrorsResponse, IResponse } from '../types/query';
import { ISODate } from './customTypes';
import { Pagination, Sorting } from './baseModels';
import { RootInstance } from '.';

export const Category = types.model('Category', {
  id: types.identifier,
  name: types.maybeNull(types.string),
  photo: types.maybeNull(types.string),
  createdAt: types.maybeNull(ISODate),
  updatedAt: types.maybeNull(ISODate),
});

export const CategoriesModel = types
  .model('CategoriesModel', {
    loading: types.optional(types.boolean, false),
    data: types.optional(types.array(Category), []),
    pagination: Pagination,
    sorting: Sorting,
  })
  .actions((self) => {
    const rootStore = getParent<RootInstance>(self);
    const fetchCategories = flow(function* () {
      self.loading = true;

      const params = { pagination: getSnapshot(self.pagination), sorting: getSnapshot(self.sorting) };
      const response: IResponse<ICategoriesResponse> = yield makeQuery('categories', 'GET', null, params);

      self.loading = false;

      if (response.ok) {
        self.data.clear();
        self.data.push(...response.data.data);
        self.pagination.total = response.data.pagination.total;
      }

      return response;
    });

    const addCategory = flow(function* ({ ...categoryData }: ICategoryRequest) {
      self.loading = true;

      const response: IResponse<ICategory> = yield makeQuery('categories', 'POST', categoryData);

      self.loading = false;
      if (response.ok) {
        self.data.push({ ...response.data });
        self.pagination.total++;
        rootStore.setNotificationSuccess(`Категория ${response.data.name} успешно добавлена`);
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }
    });

    const updateCategory = flow(function* (id: string, { ...categoryData }: ICategoryRequest) {
      self.loading = true;

      const response: IResponse<ICategory> = yield makeQuery(`categories/${id}`, 'PUT', categoryData);

      self.loading = false;
      if (response.ok) {
        const index = self.data.findIndex((searchCategory) => searchCategory.id === id);

        if (index !== -1) {
          applySnapshot(self.data[index], response.data);
        }
        rootStore.setNotificationSuccess(`Категория ${response.data.name} успешно обновлена`);
      }
    });

    const removeCategory = flow(function* (id: string) {
      self.loading = true;

      const response: IResponse<ICategory> = yield makeQuery(`categories/${id}`, 'DELETE');

      self.loading = false;
      if (response.ok) {
        const index = self.data.findIndex((searchProduct) => searchProduct.id === id);

        if (index !== -1) {
          self.data.splice(index, 1);
        }
        self.pagination.total--;
        rootStore.setNotificationSuccess(`Категория ${response.data.name} успешно удалена`);
      }
    });

    const goToPage = (page: number, pageSize: number) => {
      self.pagination.pageNumber = page;
      self.pagination.pageSize = pageSize;
      fetchCategories();
    };

    return { fetchCategories, addCategory, updateCategory, removeCategory, goToPage };
  })
  .views((self) => ({
    getCategoryById(id: string) {
      return self.data.find((item) => item.id === id);
    },
  }));
