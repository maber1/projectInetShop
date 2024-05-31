import React, { useCallback, useState } from 'react';
import { Button, Col, Flex, Form, Input, Row, Space, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useStore } from '../../../store';
import { observer } from 'mobx-react-lite';
import { Field, renderFields } from '../../common/Form';
import { Link, Navigate } from 'react-router-dom';
import { IErrorsResponse } from '../../../types/query';

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

export const RegisterForm = observer(() => {
  const { user } = useStore();
  const [form] = useForm();
  const [error, setError] = useState('');

  const handleLogin = useCallback(async () => {
    const { email, password } = form.getFieldsValue();
    setError('');
    const result = await user.registerUser({ email, password });
    if (!result.ok) {
      setError((result.data as unknown as IErrorsResponse).errors[0].message);
    }
  }, [form, user]);

  if (user.access_token) {
    return <Navigate to={'/'} />;
  }

  return (
    <Flex justify="center" align="center">
      <Row>
        <Col>
          <Title>Регистрация</Title>
          <Form onFinish={handleLogin} form={form} layout="vertical">
            {renderFields(fields)}
            <Form.Item>
              <Button loading={user.loading} htmlType="submit" type="primary">
                Регистрация
              </Button>
            </Form.Item>
          </Form>
          <Text>
            <Link to="/login">Войти</Link>
          </Text>
          <Space>{error && <Text type="danger">{error}</Text>}</Space>
        </Col>
      </Row>
    </Flex>
  );
});
