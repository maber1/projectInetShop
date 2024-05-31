import { IOrderProduct } from '../../../types/orders';
import React, { FC } from 'react';
import { Divider, Flex, Image, Space } from 'antd';
import Title from 'antd/es/typography/Title';

interface IOrderProps {
  orderProducts: IOrderProduct[];
}

export const OrderProducts: FC<IOrderProps> = ({ orderProducts }) => {
  const countProducts = orderProducts.length - 1;

  return orderProducts.map((product, index) => (
    <React.Fragment key={product.product.id}>
      <Flex key={product.product.id} justify="space-between">
        <Space>
          <Image
            width={50}
            height={50}
            src={product.product.photo}
            fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgICA8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiCiAgICAgICAgZD0iTTMwIDMuNDE0IDI4LjU4NiAyIDIgMjguNTg2IDMuNDE0IDMwbDItMkgyNmEyLjAwMyAyLjAwMyAwIDAgMCAyLTJWNS40MTRaTTI2IDI2SDcuNDE0bDcuNzkzLTcuNzkzIDIuMzc5IDIuMzc5YTIgMiAwIDAgMCAyLjgyOCAwTDIyIDE5bDQgMy45OTdabTAtNS44MzItMi41ODYtMi41ODZhMiAyIDAgMCAwLTIuODI4IDBMMTkgMTkuMTY4bC0yLjM3Ny0yLjM3N0wyNiA3LjQxNFpNNiAyMnYtM2w1LTQuOTk3IDEuMzczIDEuMzc0IDEuNDE2LTEuNDE2LTEuMzc1LTEuMzc1YTIgMiAwIDAgMC0yLjgyOCAwTDYgMTYuMTcyVjZoMTZWNEg2YTIuMDAyIDIuMDAyIDAgMCAwLTIgMnYxNloiIC8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDMydjMySDB6IiAvPgo8L3N2Zz4="
          />
          <Space direction="vertical">
            <Title level={5} style={{ margin: 0 }}>
              {product.product.name}
            </Title>
            <p style={{ margin: 0 }}>{product.product.desc}</p>
          </Space>
        </Space>
        <Space>{product.quantity} шт.</Space>
      </Flex>
      {countProducts > index && <Divider style={{ margin: '10px 0' }} />}
    </React.Fragment>
  ));
};
