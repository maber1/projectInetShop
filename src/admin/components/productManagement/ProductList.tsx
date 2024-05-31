import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { Button, Flex, Form, Image, List, Modal, PaginationProps, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, FileAddOutlined } from '@ant-design/icons';
import { getSnapshot } from 'mobx-state-tree';
import { ProductForm } from './ProductForm';

const { Title } = Typography;

export const ProductList = observer(() => {
  const { products } = useStore();
  const [modal, contextHolder] = Modal.useModal();
  const [openModal, setOpenModal] = useState(false);
  const [productID, setProductID] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handlePageChange: PaginationProps['onChange'] = (page, pageSize) => {
    products.goToPage(page, pageSize);
  };

  const callbacks = {
    onOpenEdit: (productId: string) => {
      setProductID(productId);
      setOpenModal(true);
    },
    onOpenAdd: () => {
      setProductID(null);
      setOpenModal(true);
    },
    onOk: () => {
      form
        .validateFields()
        .then(() => {
          if (productID) {
            setOpenModal(false);
          } else {
            setOpenModal(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onCancel: () => {
      setOpenModal(false);
    },
    showDeleteConfirm: (id: string) => {
      modal.confirm({
        title: 'Вы уверены, что хотите удалить этот товар?',
        icon: <ExclamationCircleFilled />,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk() {
          products.removeProduct(id);
        },
      });
    },
  };

  const data = getSnapshot(products.data);

  return (
    <>
      <Flex justify="end">
        <Button onClick={callbacks.onOpenAdd} icon={<FileAddOutlined />}>
          Добавить товар
        </Button>
      </Flex>
      <List
        pagination={{
          position: 'bottom',
          align: 'center',
          onChange: handlePageChange,
          defaultCurrent: products.pagination.pageNumber,
          pageSize: products.pagination.pageSize,
          total: products.pagination.total,
        }}
        size="small"
        dataSource={data}
        loading={products.loading}
        renderItem={(product) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                onClick={() => callbacks.onOpenEdit(product.id)}
                title="Редактировать"
                shape="circle"
                icon={<EditOutlined />}
              />,
              <Button
                key="remove"
                onClick={() => callbacks.showDeleteConfirm(product.id)}
                title="Удалить"
                shape="circle"
                icon={<DeleteOutlined />}
              />,
            ]}
          >
            <Flex>
              <Space>
                <Image
                  width={50}
                  height={50}
                  src={product.photo}
                  fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgICA8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiCiAgICAgICAgZD0iTTMwIDMuNDE0IDI4LjU4NiAyIDIgMjguNTg2IDMuNDE0IDMwbDItMkgyNmEyLjAwMyAyLjAwMyAwIDAgMCAyLTJWNS40MTRaTTI2IDI2SDcuNDE0bDcuNzkzLTcuNzkzIDIuMzc5IDIuMzc5YTIgMiAwIDAgMCAyLjgyOCAwTDIyIDE5bDQgMy45OTdabTAtNS44MzItMi41ODYtMi41ODZhMiAyIDAgMCAwLTIuODI4IDBMMTkgMTkuMTY4bC0yLjM3Ny0yLjM3N0wyNiA3LjQxNFpNNiAyMnYtM2w1LTQuOTk3IDEuMzczIDEuMzc0IDEuNDE2LTEuNDE2LTEuMzc1LTEuMzc1YTIgMiAwIDAgMC0yLjgyOCAwTDYgMTYuMTcyVjZoMTZWNEg2YTIuMDAyIDIuMDAyIDAgMCAwLTIgMnYxNloiIC8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDMydjMySDB6IiAvPgo8L3N2Zz4="
                />
                <Space direction="vertical">
                  <Title level={5} style={{ margin: 0 }}>
                    {product.name}
                  </Title>
                  <p style={{ margin: 0 }}>{product.desc}</p>
                </Space>
              </Space>
            </Flex>
          </List.Item>
        )}
      />
      <Modal
        centered
        destroyOnClose
        open={openModal}
        okButtonProps={{ form: 'formProduct', htmlType: 'submit' }}
        title={productID ? <Title level={4}>Редактировать товар</Title> : <Title level={4}>Добавить товар</Title>}
        onOk={callbacks.onOk}
        onCancel={callbacks.onCancel}
        okText={productID ? 'Сохранить' : 'Добавить'}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn key="submit" />
          </>
        )}
      >
        <ProductForm productId={productID} form={form} />
      </Modal>
      {contextHolder}
    </>
  );
});
