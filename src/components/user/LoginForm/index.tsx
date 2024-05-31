import React, { useCallback } from 'react';
import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';
import { Field, renderFields } from '../../common/Form';
import { Link, Navigate } from 'react-router-dom';

const { useForm } = Form;
const { Text, Title } = Typography;

const fields: Field[] = [
  {
    name: 'email',
    label: 'Email',
    required: true,
    element: <Input placeholder="Введите email" prefix={<UserOutlined />} />,
    typeInput: 'email',
  },
  {
    name: 'password',
    label: 'Пароль',
    required: true,
    element: <Input.Password placeholder="Введите пароль" prefix={<LockOutlined />} />,
  },
];

export const LoginForm = observer(() => {
  const { user } = useStore();
  const [form] = useForm();

  const handleLogin = useCallback(() => {
    const { email, password } = form.getFieldsValue();
    user.login({ email, password });
    form.resetFields();
  }, [form, user]);

  if (user.access_token) {
    return <Navigate to={'/'} />;
  }

  return (
    <Flex justify="center" align="center">
      <Row>
        <Col>
          <Title>Войти</Title>
          <Form onFinish={handleLogin} form={form} layout="vertical">
            {renderFields(fields)}
            <Form.Item>
              <Button loading={user.loading} htmlType="submit" type="primary">
                Войти
              </Button>
            </Form.Item>
          </Form>
          <Text>
            <Link to="/register">Зарегистрироваться</Link>
          </Text>
        </Col>
      </Row>
    </Flex>
  );
});
