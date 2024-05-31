import { Select } from 'antd';
import React, { FC } from 'react';
import { useStore } from '../../../store';
import { IOrderStatus } from '../../../types/orders';

export const orderStatusOptions = Object.keys(IOrderStatus).map((key) => ({
  label: key,
  value: IOrderStatus[key as keyof typeof IOrderStatus],
}));

export const SelectOrderStatus: FC<{ id: string; status: string }> = ({ id, status }) => {
  const { orders } = useStore();

  return (
    <Select
      defaultValue={status}
      options={orderStatusOptions}
      style={{ width: 190 }}
      onChange={(value: string) => {
        orders.changeOrderStatus(id, value);
      }}
    />
  );
};
