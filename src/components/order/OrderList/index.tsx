import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { Button, Collapse, Divider, Flex, List, Modal } from 'antd';
import { CaretRightOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { getSnapshot } from 'mobx-state-tree';
import moment from 'moment/moment';
import { SelectOrderStatus } from '../SelectOrderStatus';
import { priceFormat } from '../../../helpers';
import React from 'react';
import Title from 'antd/es/typography/Title';
import { OrderProducts } from '../../';

export const OrderList = observer(() => {
  const { orders } = useStore();
  const [modal, contextHolder] = Modal.useModal();

  const callbacks = {
    showDeleteConfirm: (id: string) => {
      modal.confirm({
        title: 'Вы уверены, что хотите удалить этот заказ?',
        icon: <ExclamationCircleFilled />,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: () => {
          orders.removeOrder(id);
        },
      });
    },
    handlePageChange: (page: number, pageSize: number) => {
      orders.goToPage(page, pageSize);
    },
  };

  const data = getSnapshot(orders.data);

  return (
    <>
      <List
        pagination={{
          position: 'bottom',
          align: 'center',
          onChange: callbacks.handlePageChange,
          defaultCurrent: orders.pagination.pageNumber,
          pageSize: orders.pagination.pageSize,
          total: orders.pagination.total,
        }}
        size="small"
        dataSource={data}
        loading={orders.loading}
        renderItem={(order) => (
          <List.Item
            actions={[
              <Button
                key="remove"
                onClick={() => callbacks.showDeleteConfirm(order.id)}
                title="Удалить"
                shape="circle"
                icon={<DeleteOutlined />}
              />,
            ]}
          >
            <Collapse
              style={{ width: '100%' }}
              ghost
              size="small"
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              items={[
                {
                  key: order.id,
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      Заказ #{order.id} от {moment(order.createdAt).format('LLL')}
                    </Title>
                  ),
                  children: (
                    <>
                      <OrderProducts orderProducts={order.products} />
                      <Divider style={{ margin: '10px 0' }} />
                      <Flex justify="space-between">
                        <div>
                          Статус: <SelectOrderStatus id={order.id} status={order.status} />
                        </div>
                        <div>
                          Общая стоимость <b>{priceFormat(orders.totalPriceOrder(order.id))}</b> руб.
                        </div>
                      </Flex>
                    </>
                  ),
                },
              ]}
            />
          </List.Item>
        )}
      />
      {contextHolder}
    </>
  );
});
