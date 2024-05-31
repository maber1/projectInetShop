import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu as MenuAnt } from 'antd';
import { useStore } from '../../../store';
import { routes } from '../../../routes';
import { NavLink, useLocation } from 'react-router-dom';

export const Menu = () => {
  const { user } = useStore();
  const location = useLocation();
  const [active, setActive] = useState(0);
  const getMenu = useCallback(() => {
    return routes.filter((route) => (user.isAuth ? !route.exclude && route.title : route.isPublic && route.title));
  }, [user.isAuth]);

  const menuItems = useMemo(() => {
    return getMenu().map((route, index) => ({
      key: String(index),
      label: <NavLink to={route.path}>{route.title}</NavLink>,
      path: route.path,
    }));
  }, [getMenu]);

  useEffect(() => {
    setActive(() => menuItems.findIndex((route) => new RegExp(`^${route.path}$`).test(location.pathname)));
  }, [location.pathname, menuItems]);

  return (
    <MenuAnt
      mode="horizontal"
      selectedKeys={[String(active)]}
      items={menuItems}
      style={{ borderBottom: 'unset', flexGrow: 1 }}
    />
  );
};
