import React, { FC } from 'react';
import { Footer as AntFooter } from 'antd/es/layout/layout';

export const Footer: FC = () => {
  return (
    <AntFooter>
      InetShop ©{new Date().getFullYear()} Created by{' '}
      <a target="_blank" href="https://makarovav.ru" rel="noreferrer">
        MakarovAV
      </a>
    </AntFooter>
  );
};
