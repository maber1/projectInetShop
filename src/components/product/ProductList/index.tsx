import React, { useEffect } from 'react';
import { Flex, Pagination, PaginationProps } from 'antd';
import { Card, Loader } from '../../index';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';

export const Cardlist = observer(() => {
  const { products } = useStore();

  useEffect(() => {
    products.fetchProducts();
  }, [products]);

  const handlePageChange: PaginationProps['onChange'] = (page, pageSize) => {
    products.goToPage(page, pageSize);
  };

  return (
    <>
      <Loader loading={products.loading} />
      <Flex wrap="wrap" justify="space-around" gap={16} style={{ height: '100%' }}>
        {products.data.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </Flex>
      {
        <Flex justify="center" style={{ marginTop: '30px' }}>
          <Pagination
            hideOnSinglePage
            current={products.pagination.pageNumber}
            onChange={handlePageChange}
            total={products.pagination.total}
            pageSize={products.pagination.pageSize}
          />
        </Flex>
      }
    </>
  );
});
