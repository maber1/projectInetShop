import { applySnapshot, flow, getParent, getSnapshot, types } from 'mobx-state-tree';
import { makeQuery } from '../api';
import { IErrorsResponse, IResponse } from '../types/query';
import { IProduct, IProductRequest, IProductsResponse } from '../types/products';
import { ISODate } from './customTypes';
import { Pagination, Sorting } from './baseModels';
import { Category } from './categories';
import { RootInstance } from '.';

export const Product = types.model('Product', {
  id: types.identifier,
  name: types.string,
  photo: types.maybeNull(types.string),
  desc: types.maybeNull(types.string),
  createdAt: types.maybeNull(ISODate),
  updatedAt: types.maybeNull(ISODate),
  oldPrice: types.maybeNull(types.number),
  price: types.maybeNull(types.number),
  category: types.maybeNull(Category),
});

export const ProductsModel = types
  .model('ProductsModel', {
    loading: types.optional(types.boolean, false),
    data: types.optional(types.array(Product), []),
    pagination: Pagination,
    sorting: Sorting,
  })
  .actions((self) => {
    const rootStore = getParent<RootInstance>(self);
    const fetchProducts = flow(function* () {
      self.loading = true;

      const params = { pagination: getSnapshot(self.pagination), sorting: getSnapshot(self.sorting) };
      const response: IResponse<IProductsResponse> = yield makeQuery('products', 'GET', null, params);

      self.loading = false;

      if (response.ok) {
        self.data.clear();
        self.data.push(...response.data.data);
        self.pagination.total = response.data.pagination.total;
      }

      return response;
    });

    const addProduct = flow(function* ({ ...productData }: IProductRequest) {
      self.loading = true;

      const response: IResponse<IProduct> = yield makeQuery('products', 'POST', productData);

      self.loading = false;
      if (response.ok) {
        self.data.push({ ...response.data });
        self.pagination.total++;
        rootStore.setNotificationSuccess(`Товар ${response.data.name} успешно добавлен`);
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }
    });

    const updateProduct = flow(function* (id: string, { ...productData }: IProductRequest) {
      self.loading = true;

      const response: IResponse<IProduct> = yield makeQuery(`products/${id}`, 'PUT', productData);

      self.loading = false;
      if (response.ok) {
        const index = self.data.findIndex((searchProduct) => searchProduct.id === id);

        if (index !== -1) {
          applySnapshot(self.data[index], response.data);
        }
        rootStore.setNotificationSuccess(`Товар ${response.data.name} успешно обновлен`);
      }
    });

    const removeProduct = flow(function* (id: string) {
      self.loading = true;

      const response: IResponse<IProduct> = yield makeQuery(`products/${id}`, 'DELETE');

      self.loading = false;
      if (response.ok) {
        const index = self.data.findIndex((searchProduct) => searchProduct.id === id);

        if (index !== -1) {
          self.data.splice(index, 1);
        }
        self.pagination.total--;
        rootStore.setNotificationSuccess(`Товар ${response.data.name} успешно удален`);
      }
    });

    // const fetchSingleProduct = flow(function* (id) {
    //   self.loading = true;

    //   const response: IResponse<IProductsResponse> = yield makeQuery(`products/${id}`, 'GET');

    //   self.loading = false;

    //   if (response.ok) {
    //     // self.data.clear();
    //     self.data.push(...response.data.data);
    //     self.pagination.total = response.data.pagination.total;
    //   }

    //   return response;
    // });

    // const loadMoreProducts = () => {
    //   self.pagination.pageNumber++;
    //   self.data.length < self.pagination.total && fetchProducts();
    // };

    const goToPage = (page: number, pageSize: number) => {
      self.pagination.pageNumber = page;
      self.pagination.pageSize = pageSize;
      fetchProducts();
    };

    return {
      fetchProducts,
      addProduct,
      updateProduct,
      removeProduct,
      /* fetchSingleProduct, */ /* loadMoreProducts, */ goToPage,
    };
  })
  .views((self) => ({
    getProductById(id: string) {
      const product = self.data.find((item) => item.id === id);
      return {
        ...product,
        ...(product?.category?.id && { categoryId: product.category.id }),
      };
    },
  }));
