import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { IOrderStatus } from '../../../types/orders';
import { Button, Flex } from 'antd';
import { priceFormat } from '../../../helpers';
import React from 'react';

export const TotalCart = observer(() => {
  const { cart, user, orders } = useStore();
  const { totalPrice, totalQuantity } = cart.totalCart();
  const callbacks = {
    handleCreateOrder: () => {
      const orderData = {
        products: cart.data.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        })),
        status: IOrderStatus.PendingConfirmation,
      };
      orders.createOrder(orderData);
    },
  };
  return (
    <Flex justify="space-between" style={{ padding: '30px 10px' }}>
      {totalQuantity > 0 && (
        <div>
          Общее количество позиций <b>{totalQuantity}</b> шт. <br />
          Общая стоимость <b>{priceFormat(totalPrice)}</b> руб.
        </div>
      )}
      {user.isAuth && totalQuantity > 0 && (
        <div>
          <Button onClick={callbacks.handleCreateOrder}>Оформить заказ</Button>
        </div>
      )}
    </Flex>
  );
});
