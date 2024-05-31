import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { getSnapshot } from 'mobx-state-tree';
import { Button, Flex, Image, List, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { priceFormat } from '../../../helpers';
import React from 'react';
import { TotalCart } from '../../';

const { Title } = Typography;

export const CartListItems = observer(() => {
  const { cart } = useStore();
  const data = getSnapshot(cart.data);

  const callbacks = {
    handleRemoveFromCart: (id: string) => {
      cart.removeFromCart(id);
    },
  };
  return (
    <List
      size="small"
      dataSource={data}
      loading={cart.loading}
      footer={<TotalCart />}
      renderItem={(product) => (
        <List.Item
          actions={[
            <Button
              key="remove"
              onClick={() => callbacks.handleRemoveFromCart(product.id)}
              title="Удалить"
              shape="circle"
              icon={<DeleteOutlined />}
            />,
          ]}
        >
          <Flex align="baseline" gap={8} style={{ flexGrow: 1 }}>
            <Image
              width={50}
              height={50}
              src={product.photo}
              fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgICA8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiCiAgICAgICAgZD0iTTMwIDMuNDE0IDI4LjU4NiAyIDIgMjguNTg2IDMuNDE0IDMwbDItMkgyNmEyLjAwMyAyLjAwMyAwIDAgMCAyLTJWNS40MTRaTTI2IDI2SDcuNDE0bDcuNzkzLTcuNzkzIDIuMzc5IDIuMzc5YTIgMiAwIDAgMCAyLjgyOCAwTDIyIDE5bDQgMy45OTdabTAtNS44MzItMi41ODYtMi41ODZhMiAyIDAgMCAwLTIuODI4IDBMMTkgMTkuMTY4bC0yLjM3Ny0yLjM3N0wyNiA3LjQxNFpNNiAyMnYtM2w1LTQuOTk3IDEuMzczIDEuMzc0IDEuNDE2LTEuNDE2LTEuMzc1LTEuMzc1YTIgMiAwIDAgMC0yLjgyOCAwTDYgMTYuMTcyVjZoMTZWNEg2YTIuMDAyIDIuMDAyIDAgMCAwLTIgMnYxNloiIC8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDMydjMySDB6IiAvPgo8L3N2Zz4="
            />
            <Title level={5} style={{ margin: 0, flexGrow: 1 }}>
              {product.name}
            </Title>
            <div>
              <span style={{ margin: '0 10px' }}>
                <b>{priceFormat(product.price)} ₽</b>
              </span>
              <span>{product.quantity} шт.</span>
            </div>
          </Flex>
        </List.Item>
      )}
    />
  );
});
