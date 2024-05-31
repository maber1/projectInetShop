import React from 'react';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { Admin } from './admin/pages/';
import { Orders } from './pages/Orders';
import { Home } from './pages/Home';

interface IRoute {
  path: string;
  title?: string;
  element: JSX.Element;
  children?: IRoute[];
  isPublic?: boolean;
  exclude?: boolean;
}

export const routes: IRoute[] = [
  {
    path: '/',
    element: <Home />,
    title: 'Главная',
    isPublic: true,
  },
  {
    path: '/login',
    element: <Login />,
    isPublic: true,
    exclude: true,
  },
  {
    path: '/register',
    element: <Register />,
    isPublic: true,
    exclude: true,
  },
  {
    path: '/profile',
    element: <Profile />,
    title: 'Профиль',
    isPublic: false,
    exclude: true,
  },
  {
    path: '/cart',
    element: <Cart />,
    title: 'Корзина',
    isPublic: true,
  },
  {
    path: '/orders',
    element: <Orders />,
    title: 'Заказы',
    isPublic: false,
  },
  {
    path: '/admin',
    element: <Admin />,
    title: 'Управление',
    isPublic: false,
  },
];
