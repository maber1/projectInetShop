import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { OrderList } from '../../components';

export const Orders = () => {
  const { orders } = useStore();

  useEffect(() => {
    orders.fetchOrders();
  }, [orders]);

  return <OrderList />;
};
