import { Instance, types } from 'mobx-state-tree';
import { UserModel } from './user';
import { createContext, useContext } from 'react';
import { ProductsModel } from './products';
import { CategoriesModel } from './categories';
import { CartModel } from './cart';
import { OrdersModel } from './orders';

const RootModel = types
  .model('RootModel', {
    user: UserModel,
    products: ProductsModel,
    categories: CategoriesModel,
    orders: OrdersModel,
    cart: CartModel,
    notification: types.model('Notification', {
      error: types.string,
      success: types.string,
    }),
  })
  .actions((self) => {
    const setNotificationError = (error: string) => {
      self.notification.error = error;
    };
    const setNotificationSuccess = (success: string) => {
      self.notification.success = success;
    };
    const clearNotification = () => {
      self.notification.error = '';
      self.notification.success = '';
    };

    return { clearNotification, setNotificationError, setNotificationSuccess };
  });

const initialState = RootModel.create({
  user: {
    access_token: localStorage.getItem('access_token') || '',
    isAuth: Boolean(Number(localStorage.getItem('isAuth'))) || false,
    userinfo: {
      name: '...',
      id: localStorage.getItem('userID'),
    },
  },
  products: {
    data: [],
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    },
    sorting: {
      field: 'name',
      type: 'ASC',
    },
  },
  categories: {
    data: [],
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    },
    sorting: {
      field: 'name',
      type: 'ASC',
    },
  },
  cart: {
    data: [],
  },
  orders: {
    data: [],
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    },
    sorting: {
      field: 'createdAt',
      type: 'DESC',
    },
  },
  notification: {
    error: '',
    success: '',
  },
});

export const rootStore = initialState;

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const StoreProvider = RootStoreContext.Provider;
export function useStore() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be outside context provider');
  }

  return store;
}
