import styles from './layout.module.scss';
import { Link } from 'react-router-dom';
import Logo from '../../icons/logo.svg';
import { Menu } from '../common/Menu';
import { Space } from 'antd';
import { User } from '../user';
import ThemeSwitcher from '../common/ThemeSwitcher';
import React, { FC } from 'react';
import { Header as AntHeader } from 'antd/es/layout/layout';

export const Header: FC = () => {
  return (
    <AntHeader className={styles.header}>
      <Link to={'/'}>
        <Logo />
      </Link>
      <Menu />
      <Space>
        <User />
        <ThemeSwitcher />
      </Space>
    </AntHeader>
  );
};
