import { Tabs, TabsProps } from 'antd';
import React, { useEffect } from 'react';
import { ProductList } from '../components/productManagement/ProductList';
import { CategoryList } from '../components/categoryManagement/CategoryList';
import { useStore } from '../../store';

export const Admin = () => {
  const { products, categories } = useStore();
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Товары',
      children: <ProductList />,
    },
    {
      key: '2',
      label: 'Категории',
      children: <CategoryList />,
    },
  ];
  useEffect(() => {
    products.fetchProducts();
  }, [products]);

  useEffect(() => {
    categories.fetchCategories();
  }, [categories]);

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
};
