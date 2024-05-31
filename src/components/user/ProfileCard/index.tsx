import React, { useCallback } from 'react';
import { Avatar, Button, Card, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';
import { Field, renderFields } from '../../common/Form';

const { useForm } = Form;
const { Title } = Typography;
const fields: Field[] = [
  {
    name: 'oldPassword',
    label: 'Текущий пароль',
    required: true,
    element: <Input.Password placeholder="Введите текущий пароль" prefix={<LockOutlined />} />,
  },
  {
    name: 'newPassword',
    label: 'Новый пароль',
    required: true,
    element: <Input.Password placeholder="Введите новый пароль" prefix={<LockOutlined />} />,
  },
];

export const ProfileCard = observer(() => {
  const { user } = useStore();
  const [form] = useForm();

  const handleEditName = useCallback(
    (name: string) => {
      if (name !== user.userinfo.name) {
        user.updateProfile(name);
      }
    },
    [user]
  );

  const handleChangePassword = useCallback(async () => {
    const { oldPassword, newPassword } = form.getFieldsValue();
    user.changePassword(oldPassword, newPassword);
    form.resetFields();
  }, [form, user]);

  return (
    <Card style={{ maxWidth: 500 }}>
      <Flex gap={24}>
        <Avatar size={80} icon={<UserOutlined />} style={{ flexShrink: 0 }} />
        <Flex vertical gap={5}>
          <Title level={3} style={{ margin: 0 }} editable={{ onChange: handleEditName }}>
            {user.userinfo?.name}
          </Title>
          <h3 style={{ margin: 0 }}>{user.userinfo.email}</h3>
          <h5 style={{ margin: 0 }}>{user.userinfo.id}</h5>
        </Flex>
      </Flex>
      <Row>
        <Col>
          <Title level={4}>Сменить пароль</Title>
          <Form onFinish={handleChangePassword} form={form} layout="vertical">
            {renderFields(fields)}
            <Form.Item>
              <Button loading={user.loading} htmlType="submit" type="primary">
                Сменить
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
});
