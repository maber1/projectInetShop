import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const Loader: FC<{ loading: boolean }> = observer(({ loading }) => {
  return loading ? (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      spinning={loading}
      tip="Загрузка..."
      size="large"
      fullscreen
    />
  ) : null;
});
