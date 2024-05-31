import React, { PropsWithChildren } from 'react';
import { Layout as AntLayout } from 'antd';
import styles from './layout.module.scss';
import { Content } from 'antd/es/layout/layout';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <AntLayout className={styles.layout}>
      <Header />
      <Content className={styles.content}>{children}</Content>
      <Footer />
    </AntLayout>
  );
};
