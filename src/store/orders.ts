import { applySnapshot, flow, getParent, getSnapshot, types } from 'mobx-state-tree';
import { Pagination, Sorting } from './baseModels';
import { ISODate } from './customTypes';
import { Product } from './products';
import { IErrorsResponse, IResponse } from '../types/query';
import { IOrdersRequest, IOrdersResponse } from '../types/orders';
import { makeQuery } from '../api';
import { RootInstance } from './index';

export const OrderStatus = types.enumeration('OrderStatus', [
  'pending_confirmation',
  'processing',
  'packaging',
  'waiting_for_delivery',
  'in_transit',
  'delivered',
  'return_requested',
  'order_cancelled',
]);

export const OrderProduct = types.model('OrderProduct', {
  _id: types.string,
  product: Product,
  quantity: types.number,
});

export const Order = types.model('Order', {
  id: types.identifier,
  products: types.optional(types.array(OrderProduct), []),
  status: OrderStatus,
  createdAt: types.maybeNull(ISODate),
  updatedAt: types.maybeNull(ISODate),
});

export const OrdersModel = types
  .model('OrdersModel', {
    data: types.optional(types.array(Order), []),
    pagination: Pagination,
    sorting: Sorting,
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const rootStore = getParent<RootInstance>(self);
    const fetchOrders = flow(function* () {
      self.loading = true;

      const params = { pagination: getSnapshot(self.pagination), sorting: getSnapshot(self.sorting) };
      const response: IResponse<IOrdersResponse> = yield makeQuery('orders', 'GET', null, params);

      self.data.clear();
      self.data.push(...response.data.data);
      self.pagination.total = response.data.pagination.total;

      self.loading = false;
    });

    const createOrder = flow(function* ({ ...orderData }: IOrdersRequest) {
      self.loading = true;

      const response: IResponse<IOrdersResponse> = yield makeQuery('orders', 'POST', orderData);

      self.loading = false;
      if (response.ok) {
        self.data.push({ ...response.data });
        self.pagination.total++;
        rootStore.setNotificationSuccess('Заказ успешно создан');
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }
    });

    const removeOrder = flow(function* (id: string) {
      self.loading = true;

      const response: IResponse<IOrdersResponse> = yield makeQuery(`orders/${id}`, 'DELETE');

      self.loading = false;
      if (response.ok) {
        const index = self.data.findIndex((searchOrder) => searchOrder.id === id);

        if (index !== -1) {
          self.data.splice(index, 1);
        }
        self.pagination.total--;
        rootStore.setNotificationSuccess('Заказ успешно удален');
      }
    });

    const changeOrderStatus = flow(function* (id: string, status: string) {
      self.loading = true;

      const response: IResponse<IOrdersResponse> = yield makeQuery(`orders/${id}`, 'PATCH', { status: status });

      self.loading = false;
      if (response.ok) {
        const index = self.data.findIndex((searchOrder) => searchOrder.id === id);

        if (index !== -1) {
          applySnapshot(self.data[index], response.data);
        }
        rootStore.setNotificationSuccess('Статус заказа успешно обновлен');
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }
    });

    const goToPage = (page: number, pageSize: number) => {
      self.pagination.pageNumber = page;
      self.pagination.pageSize = pageSize;
      fetchOrders();
    };

    return { fetchOrders, createOrder, removeOrder, changeOrderStatus, goToPage };
  })
  .views((self) => ({
    totalPriceOrder: (id: string) => {
      const index = self.data.findIndex((searchOrder) => searchOrder.id === id);
      const totalPrice = self.data[index].products.reduce(
        (acc, product) => acc + product.quantity * product.product.price,
        0
      );

      return totalPrice;
    },
  }));
