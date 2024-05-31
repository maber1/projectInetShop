import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const User = observer(() => {
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth) {
      user.fetchProfile();
    }
  }, [user]);

  const onLogout = useCallback(() => {
    user.logout();
  }, [user]);

  const items: MenuProps['items'] = [
    {
      label: 'Выход',
      onClick: onLogout,
      key: '2',
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Space>
      {!user.isAuth ? (
        <Button onClick={() => navigate('/login')}>Войти</Button>
      ) : (
        <Dropdown menu={{ items }}>
          <Link to="/profile">
            <Space>
              <Text>{user.userinfo.name}</Text>
              <Avatar icon={<UserOutlined />} />
            </Space>
          </Link>
        </Dropdown>
      )}
    </Space>
  );
});

export { User };
