import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import React, { useState } from 'react';
import { Button, Flex, Form, List, Modal, PaginationProps, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, FileAddOutlined } from '@ant-design/icons';
import { getSnapshot } from 'mobx-state-tree';
import { CategoryForm } from './CategoryForm';

const { Title } = Typography;

export const CategoryList = observer(() => {
  const { categories } = useStore();
  const [categoryID, setCategoryID] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [openModal, setOpenModal] = useState(false);

  const handlePageChange: PaginationProps['onChange'] = (page, pageSize) => {
    categories.goToPage(page, pageSize);
  };

  const callbacks = {
    onOpenEdit: (categoryID: string) => {
      setCategoryID(categoryID);
      setOpenModal(true);
    },
    onOpenAdd: () => {
      setCategoryID(null);
      setOpenModal(true);
    },
    onOk: () => {
      form
        .validateFields()
        .then(() => {
          if (categoryID) {
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
        title: 'Вы уверены, что хотите удалить эту категорию?',
        icon: <ExclamationCircleFilled />,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk() {
          categories.removeCategory(id);
        },
      });
    },
  };
  const data = getSnapshot(categories.data);

  return (
    <>
      <Flex justify="end">
        <Button onClick={callbacks.onOpenAdd} icon={<FileAddOutlined />}>
          Добавить категорию
        </Button>
      </Flex>
      <List
        pagination={{
          position: 'bottom',
          align: 'center',
          onChange: handlePageChange,
          defaultCurrent: categories.pagination.pageNumber,
          pageSize: categories.pagination.pageSize,
          total: categories.pagination.total,
          hideOnSinglePage: true,
        }}
        size="small"
        dataSource={data}
        loading={categories.loading}
        renderItem={(category) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                onClick={() => callbacks.onOpenEdit(category.id)}
                title="Редактировать"
                shape="circle"
                icon={<EditOutlined />}
              />,
              <Button
                key="remove"
                onClick={() => callbacks.showDeleteConfirm(category.id)}
                title="Удалить"
                shape="circle"
                icon={<DeleteOutlined />}
              />,
            ]}
          >
            <Space direction="vertical">
              <Title level={5} style={{ margin: 0 }}>
                {category.name}
              </Title>
            </Space>
          </List.Item>
        )}
      />
      <Modal
        centered
        destroyOnClose
        open={openModal}
        okButtonProps={{ form: 'formCategory', htmlType: 'submit' }}
        title={
          categoryID ? <Title level={4}>Редактировать категорию</Title> : <Title level={4}>Добавить категорию</Title>
        }
        onOk={callbacks.onOk}
        onCancel={callbacks.onCancel}
        okText={categoryID ? 'Сохранить' : 'Добавить'}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn key="submit" />
          </>
        )}
      >
        <CategoryForm categoryId={categoryID} form={form} />
      </Modal>
      {contextHolder}
    </>
  );
});
